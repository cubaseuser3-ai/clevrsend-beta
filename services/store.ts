import type {
  ClientInfo,
  ClientInfoWithoutId,
  WsServerMessage,
  WsServerSdpMessage,
} from "~/services/signaling";
import { SignalingConnection } from "~/services/signaling";
import {
  defaultStun,
  type FileDto,
  type FileProgress,
  receiveFiles,
  sendFiles,
} from "~/services/webrtc";
import { generateClientTokenFromCurrentTimestamp } from "~/services/crypto";

export enum SessionState {
  idle = "idle",
  sending = "sending",
  receiving = "receiving",
}

export type FileState = {
  id: string;
  name: string;
  curr: number;
  total: number;
  state: "pending" | "skipped" | "sending" | "finished" | "error";
  error?: string;
};

export const store = reactive({
  // Whether the connection loop has started
  _loopStarted: false,

  // Client information of the current user that we send to the server
  _proposingClient: null as ClientInfoWithoutId | null,

  _onPin: null as (() => Promise<string | null>) | null,

  // Callback for QR-Connect answer messages
  _onQRAnswer: null as ((answer: string, senderId?: string) => void) | null,

  // Callback for incoming ICE candidates (Trickle ICE)
  _onIceCandidate: null as ((candidate: RTCIceCandidateInit) => void) | null,

  // Connected peer ID for QR-Connect (for Trickle ICE routing)
  qrConnectedPeerId: null as string | null,

  // Public and private key pair for signing and verifying messages
  key: null as CryptoKeyPair | null,

  /// PIN code used before receiving or sending files
  pin: null as string | null,

  // Signaling connection to the server (LocalSend for normal peer discovery)
  signaling: null as SignalingConnection | null,

  // Separate signaling connection for QR-Connect (Deno server for QR_ANSWER support)
  qrSignaling: null as SignalingConnection | null,

  // Client ID from QR signaling server (for answer routing)
  qrClientId: null as string | null,

  // Client information of the current user that we received from the server
  client: null as ClientInfo | null,

  // List of peers connected to the same room
  peers: [] as ClientInfo[],

  // Current session information
  session: {
    state: SessionState.idle,
    curr: 0,
    total: 1, // Avoid division by zero
    fileState: {} as Record<string, FileState>,
  },

  // Retry status for UI feedback
  retryStatus: {
    isRetrying: false,
    type: null as 'signaling' | 'qr-signaling' | 'webrtc' | 'file-transfer' | null,
    attempt: 0,
    maxAttempts: 0,
    message: '',
  },
});

export async function setupConnection({
  info,
  onPin,
}: {
  info: ClientInfoWithoutId;
  onPin: () => Promise<string | null>;
}) {
  store._proposingClient = info;
  store._onPin = onPin;
  if (!store._loopStarted) {
    store._loopStarted = true;
    connectionLoop().then(() => console.log("Connection loop ended"));

    // Setup Page Visibility API for auto-reconnect on tab return
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !store.signaling) {
          console.log('📱 Tab became visible and no connection - reconnecting...');
          // Connection will be reestablished by the connection loop
          // which runs continuously and tries to reconnect on failure
        }
      });
      console.log('✅ Page Visibility API listener registered');
    }
  }
}

async function connectionLoop() {
  // Signaling servers (primary + fallback)
  const signalingServers = [
    "wss://public.localsend.org/v1/ws", // Primary: Official LocalSend server
    "wss://clevrsend-signaling.mytechsupport.deno.net", // Fallback: Deno Deploy signaling server
  ];

  let currentServerIndex = 0;

  while (true) {
    try {
      const currentUrl = signalingServers[currentServerIndex];
      console.log(`Connecting to signaling server: ${currentUrl}`);

      store.signaling = await SignalingConnection.connect({
        url: currentUrl,
        info: store._proposingClient!,
        onMessage: (data: WsServerMessage) => {
          switch (data.type) {
            case "HELLO":
              store.client = data.client;
              store.peers = data.peers;
              console.log(`Connected successfully to ${currentUrl}`);
              currentServerIndex = 0; // Reset to primary on successful connection
              break;
            case "JOIN":
              store.peers = [...store.peers, data.peer];
              break;
            case "UPDATE":
              store.peers = store.peers.map((p) =>
                p.id === data.peer.id ? data.peer : p,
              );
              break;
            case "LEFT":
              store.peers = store.peers.filter((p) => p.id !== data.peerId);
              break;
            case "OFFER":
              acceptOffer({ offer: data, onPin: store._onPin! });
              break;
            case "ANSWER":
              break;
            case "QR_ANSWER":
              // Handle QR-Connect answer from receiver
              if (store._onQRAnswer && (data as any).answer) {
                console.log('📨 Store: Received QR_ANSWER, calling callback');
                store._onQRAnswer((data as any).answer);
                store._onQRAnswer = null; // Clear callback after use
              }
              break;
          }
        },
        generateNewInfo: async () => {
          const token = await generateClientTokenFromCurrentTimestamp(
            store.key!,
          );
          updateClientTokenState(token);
          return { ...store._proposingClient!, token };
        },
        onClose: () => {
          store.signaling = null;
          store.client = null;
          store.peers = [];
        },
      });

      await store.signaling.waitUntilClose();
    } catch (error) {
      console.error(`Connection failed to ${signalingServers[currentServerIndex]}:`, error);

      // Try fallback server
      const previousIndex = currentServerIndex;
      currentServerIndex = (currentServerIndex + 1) % signalingServers.length;

      if (currentServerIndex === 0) {
        // Tried all servers, wait before retrying
        console.log("All signaling servers failed. Retrying in 5 seconds...");

        store.retryStatus.isRetrying = true;
        store.retryStatus.type = 'signaling';
        store.retryStatus.attempt = 1;
        store.retryStatus.maxAttempts = signalingServers.length;
        store.retryStatus.message = 'Signaling-Server nicht erreichbar. Wiederhole in 5s...';

        await new Promise((resolve) => setTimeout(resolve, 5000));

        store.retryStatus.isRetrying = false;
        store.retryStatus.type = null;
        store.retryStatus.message = '';
      } else {
        // Immediately try next server
        console.log(`Trying fallback server: ${signalingServers[currentServerIndex]}`);

        store.retryStatus.isRetrying = true;
        store.retryStatus.type = 'signaling';
        store.retryStatus.attempt = currentServerIndex + 1;
        store.retryStatus.maxAttempts = signalingServers.length;
        store.retryStatus.message = `Versuche Fallback-Server...`;

        // Give UI a moment to show the retry message
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }
}

export function updateAliasState(alias: string) {
  store._proposingClient!.alias = alias;
  store.client!.alias = alias;
}

function updateClientTokenState(token: string) {
  store._proposingClient!.token = token;
  store.client!.token = token;
}

const PIN_MAX_TRIES = 3;

export async function startSendSession({
  files,
  targetId,
  onPin,
}: {
  files: FileList;
  targetId: string;
  onPin: () => Promise<string | null>;
}): Promise<void> {
  store.session.state = SessionState.sending;
  const fileState: Record<string, FileState> = {};

  const fileDtoList = convertFileListToDto(files);
  const fileMap = fileDtoList.reduce(
    (acc, file) => {
      acc[file.id] = files[parseInt(file.id)];
      fileState[file.id] = {
        id: file.id,
        name: file.fileName,
        curr: 0,
        total: file.size,
        state: "pending",
      };
      return acc;
    },
    {} as Record<string, File>,
  );

  store.session.fileState = fileState;
  store.session.curr = 0;
  store.session.total = fileDtoList.reduce((acc, file) => acc + file.size, 0);

  try {
    await sendFiles({
      signaling: store.signaling as SignalingConnection,
      stunServers: defaultStun,
      fileDtoList: fileDtoList,
      fileMap: fileMap,
      targetId: targetId,
      signingKey: store.key!,
      pin: store.pin ? { pin: store.pin, maxTries: PIN_MAX_TRIES } : undefined,
      onPin: onPin,
      onFilesSkip: (fileIds) => {
        for (const id of fileIds) {
          store.session.fileState[id].state = "skipped";
        }
      },
      onFileProgress: onFileProgress,
    });
  } finally {
    store.session.state = SessionState.idle;
  }
}

function convertFileListToDto(files: FileList): FileDto[] {
  const result: FileDto[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    result.push({
      id: i.toString(),
      fileName: file.name,
      size: file.size,
      fileType: file.type,
      metadata: {
        modified: new Date(file.lastModified).toISOString(),
      },
    });
  }

  return result;
}

export async function acceptOffer({
  offer,
  onPin,
}: {
  offer: WsServerSdpMessage;
  onPin: () => Promise<string | null>;
}) {
  store.session.state = SessionState.receiving;

  try {
    await receiveFiles({
      signaling: store.signaling as SignalingConnection,
      stunServers: defaultStun,
      offer: offer,
      signingKey: store.key!,
      pin: store.pin ? { pin: store.pin, maxTries: PIN_MAX_TRIES } : undefined,
      onPin: onPin,
      selectFiles: async (files) => {
        // Select all files
        store.session.curr = 0;
        store.session.total = files.reduce((acc, file) => acc + file.size, 0);
        store.session.fileState = {};
        for (const file of files) {
          store.session.fileState[file.id] = {
            id: file.id,
            name: file.fileName,
            curr: 0,
            total: file.size,
            state: "pending",
          };
        }
        return files.map((file) => file.id);
      },
      onFileProgress: onFileProgress,
    });
  } finally {
    store.session.state = SessionState.idle;
  }
}

function onFileProgress(progress: FileProgress) {
  store.session.fileState[progress.id].curr = progress.curr;
  store.session.curr = Object.values(store.session.fileState).reduce(
    (acc, file) => acc + file.curr,
    0,
  );
  if (progress.success) {
    store.session.fileState[progress.id].state = "finished";
  } else if (progress.error) {
    store.session.fileState[progress.id].state = "error";
    store.session.fileState[progress.id].error = progress.error;
  }
}

/**
 * Setup QR-Connect signaling connection to Render.com server
 * This is separate from the main signaling connection to support QR_ANSWER messages
 * Includes automatic retry with exponential backoff
 */
export async function setupQRSignaling(): Promise<SignalingConnection> {
  if (store.qrSignaling && store.qrClientId) {
    return store.qrSignaling;
  }

  if (!store.key || !store._proposingClient) {
    throw new Error("Store not initialized - call setupConnection first");
  }

  const qrSignalingUrl = "wss://clevrsend-signaling.onrender.com";
  const maxRetries = 3;
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`⏳ QR-Signaling Retry ${attempt}/${maxRetries} in ${delay}ms...`);

        store.retryStatus.isRetrying = true;
        store.retryStatus.type = 'qr-signaling';
        store.retryStatus.attempt = attempt;
        store.retryStatus.maxAttempts = maxRetries;
        store.retryStatus.message = `Verbindung wird wiederhergestellt... (Versuch ${attempt}/${maxRetries})`;

        await new Promise(resolve => setTimeout(resolve, delay));
      }

      console.log(`🔗 QR-Connect: Connecting to dedicated signaling server: ${qrSignalingUrl}`);

      // Create a promise that resolves when we receive HELLO message
      let helloResolver: () => void;
      const helloPromise = new Promise<void>((resolve) => {
        helloResolver = resolve;
      });

      store.qrSignaling = await SignalingConnection.connect({
        url: qrSignalingUrl,
        info: store._proposingClient,
        onMessage: (data: WsServerMessage) => {
          switch (data.type) {
            case "HELLO":
              // Store QR client ID for answer routing
              store.qrClientId = data.client.id;
              console.log(`✅ QR-Connect: Connected to ${qrSignalingUrl}`);
              console.log(`   - QR Client ID: ${data.client.id}`);
              helloResolver(); // Resolve the promise when HELLO is received
              break;
            case "QR_ANSWER":
              // Handle QR-Connect answer from receiver
              if (store._onQRAnswer && (data as any).answer) {
                console.log('📨 QR-Connect Store: Received QR_ANSWER, calling callback');
                const senderId = (data as any).senderId;
                store._onQRAnswer((data as any).answer, senderId);
                store._onQRAnswer = null;
              }
              break;
            case "ICE_CANDIDATE":
              // Handle incoming ICE candidate (Trickle ICE)
              if (store._onIceCandidate && (data as any).candidate) {
                console.log('📨 QR-Connect Store: Received ICE_CANDIDATE, calling callback');
                console.log(`   - From: ${(data as any).senderId}`);
                store._onIceCandidate((data as any).candidate);
              }
              break;
            default:
              // Ignore other message types for QR signaling
              break;
          }
        },
        generateNewInfo: async () => {
          const token = await generateClientTokenFromCurrentTimestamp(
            store.key!,
          );
          return {
            alias: store._proposingClient!.alias,
            version: store._proposingClient!.version,
            deviceModel: store._proposingClient!.deviceModel,
            deviceType: store._proposingClient!.deviceType,
            token,
          };
        },
        onClose: () => {
          console.log("QR-Connect signaling connection closed");
          store.qrSignaling = null;
          store.qrClientId = null;
        },
      });

      // Wait for HELLO message before returning
      await helloPromise;

      // Success! Reset retry status
      store.retryStatus.isRetrying = false;
      store.retryStatus.type = null;
      store.retryStatus.attempt = 0;
      store.retryStatus.maxAttempts = 0;
      store.retryStatus.message = '';

      return store.qrSignaling;
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ QR-Signaling attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);

      if (attempt === maxRetries) {
        // Final failure
        store.retryStatus.isRetrying = false;
        store.retryStatus.type = null;
        store.retryStatus.message = '';
        break;
      }
    }
  }

  console.error("Failed to connect to QR signaling server after all retries");
  throw lastError!;
}
