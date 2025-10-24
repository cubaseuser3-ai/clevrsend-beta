/**
 * QR-Connect Service
 * Handles direct P2P connections via QR code without traditional signaling server
 */

import { defaultStun } from "./webrtc";

export interface QRConnectOffer {
  type: 'clevrsend-qr-offer';
  version: string;
  peerId: string;
  peerAlias: string;
  senderId: string; // Signaling server ID of sender for answer routing
  offer: RTCSessionDescriptionInit;
  timestamp: number;
}

export interface QRConnectAnswer {
  type: 'clevrsend-qr-answer';
  peerId: string;
  answer: RTCSessionDescriptionInit;
}

/**
 * Generate WebRTC offer for QR code
 */
export async function generateQRConnectOffer(
  alias: string,
  senderId?: string,
  onIceCandidate?: (candidate: RTCIceCandidate) => void
): Promise<{ qrData: string; peerId: string; pc: RTCPeerConnection; dataChannel: RTCDataChannel }> {

  // Create unique peer ID
  const peerId = crypto.randomUUID();

  // Create RTCPeerConnection with STUN and TURN servers
  const pc = new RTCPeerConnection({
    iceServers: [
      // STUN servers for discovering public IP
      ...defaultStun.map(url => ({ urls: url })),
      // Multiple TURN servers for NAT traversal
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:relay.metered.ca:80',
        username: 'e17f4b83b40d5c2f49c14d1e',
        credential: 'UJlROZM2MNPsUfSn'
      },
      {
        urls: 'turn:relay.metered.ca:443',
        username: 'e17f4b83b40d5c2f49c14d1e',
        credential: 'UJlROZM2MNPsUfSn'
      }
    ],
    iceCandidatePoolSize: 10
  });

  // Setup ICE candidate logging and Trickle ICE support
  pc.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('🧊 SENDER ICE Candidate:', event.candidate.type, event.candidate.protocol, event.candidate.address || 'hidden');

      // Trickle ICE: Send candidate immediately via signaling
      if (onIceCandidate) {
        console.log('📤 Sending ICE candidate via Trickle ICE...');
        onIceCandidate(event.candidate);
      }
    } else {
      console.log('🧊 SENDER ICE Gathering complete');
    }
  });

  pc.addEventListener('icegatheringstatechange', () => {
    console.log('🧊 SENDER ICE gathering state:', pc.iceGatheringState);
  });

  pc.addEventListener('iceconnectionstatechange', () => {
    console.log('🧊 SENDER ICE connection state:', pc.iceConnectionState);
  });

  // Create data channel for file transfer
  console.log('🔧 SENDER: Creating data channel...');
  const dataChannel = pc.createDataChannel('files', {
    ordered: true
  });
  console.log('🔧 SENDER: Data channel created!');
  console.log('   - label:', dataChannel.label);
  console.log('   - readyState:', dataChannel.readyState);
  console.log('   - id:', dataChannel.id);

  // Setup data channel event listeners
  dataChannel.addEventListener('open', () => {
    console.log('✅ QR-Connect SENDER: Data channel OPEN - Ready to send files');
    console.log('   - readyState:', dataChannel.readyState);
    console.log('   - bufferedAmount:', dataChannel.bufferedAmount);
  });

  dataChannel.addEventListener('close', () => {
    console.log('❌ QR-Connect SENDER: Data channel CLOSED');
  });

  dataChannel.addEventListener('error', (error) => {
    console.error('❌ QR-Connect SENDER: Data channel ERROR:', error);
  });

  dataChannel.addEventListener('message', (event) => {
    console.log('📨 QR-Connect SENDER: Received message:', event.data);
  });

  // Create offer
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  // Wait for ICE gathering to complete (or timeout for TURN candidates)
  await new Promise<void>((resolve) => {
    if (pc.iceGatheringState === 'complete') {
      console.log('✅ ICE gathering already complete');
      resolve();
    } else {
      const checkState = () => {
        console.log(`🧊 ICE gathering state changed to: ${pc.iceGatheringState}`);
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', checkState);
          console.log('✅ ICE gathering complete - all candidates collected');
          resolve();
        }
      };
      pc.addEventListener('icegatheringstatechange', checkState);

      // Timeout after 10 seconds (increased from 5s to allow TURN candidates)
      setTimeout(() => {
        pc.removeEventListener('icegatheringstatechange', checkState);
        console.log(`⚠️ ICE gathering timeout after 10s - state: ${pc.iceGatheringState}`);
        console.log(`   Trickle ICE will continue sending candidates...`);
        resolve();
      }, 10000);
    }
  });

  // Create QR data object
  const qrOfferData: QRConnectOffer = {
    type: 'clevrsend-qr-offer',
    version: '1.0',
    peerId,
    peerAlias: alias,
    senderId: senderId || '', // Signaling server ID for answer routing
    offer: pc.localDescription!.toJSON(),
    timestamp: Date.now()
  };

  // Create deep link URL for QR code
  // Use base64url encoding to make it URL-safe
  const offerJson = JSON.stringify(qrOfferData);
  const offerBase64 = btoa(offerJson)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Create clickable URL that opens ClevrSend with connection data
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://clevrsend.vercel.app';
  const qrData = `${appUrl}/?qr=${offerBase64}`;

  return { qrData, peerId, pc, dataChannel };
}

/**
 * Process scanned QR code and create answer
 */
export async function processQRConnectOffer(
  qrData: string,
  localAlias: string,
  onIceCandidate?: (candidate: RTCIceCandidate) => void
): Promise<{ peerId: string; peerAlias: string; senderId: string; pc: RTCPeerConnection; answer: string; dataChannelPromise: Promise<RTCDataChannel> }> {

  // Parse QR data - could be URL or direct JSON
  let offerData: QRConnectOffer;

  try {
    // Try to extract from URL format first
    if (qrData.includes('/?qr=')) {
      const url = new URL(qrData);
      const base64Data = url.searchParams.get('qr');
      if (!base64Data) {
        throw new Error('No QR parameter found in URL');
      }

      // Decode base64url
      const base64 = base64Data
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const jsonStr = atob(base64);
      offerData = JSON.parse(jsonStr);
    } else {
      // Fallback to direct JSON (for backwards compatibility)
      offerData = JSON.parse(qrData);
    }
  } catch (error) {
    throw new Error('Invalid QR code format');
  }

  // Validate QR data
  if (offerData.type !== 'clevrsend-qr-offer') {
    throw new Error('Invalid QR code: Not a ClevrSend QR-Connect code');
  }

  // Create RTCPeerConnection with STUN and TURN servers
  const pc = new RTCPeerConnection({
    iceServers: [
      // STUN servers for discovering public IP
      ...defaultStun.map(url => ({ urls: url })),
      // Multiple TURN servers for NAT traversal
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: 'turn:relay.metered.ca:80',
        username: 'e17f4b83b40d5c2f49c14d1e',
        credential: 'UJlROZM2MNPsUfSn'
      },
      {
        urls: 'turn:relay.metered.ca:443',
        username: 'e17f4b83b40d5c2f49c14d1e',
        credential: 'UJlROZM2MNPsUfSn'
      }
    ],
    iceCandidatePoolSize: 10
  });

  // Setup ICE candidate logging and Trickle ICE support
  pc.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('🧊 RECEIVER ICE Candidate:', event.candidate.type, event.candidate.protocol, event.candidate.address || 'hidden');

      // Trickle ICE: Send candidate immediately via signaling
      if (onIceCandidate) {
        console.log('📤 Sending ICE candidate via Trickle ICE...');
        onIceCandidate(event.candidate);
      }
    } else {
      console.log('🧊 RECEIVER ICE Gathering complete');
    }
  });

  pc.addEventListener('icegatheringstatechange', () => {
    console.log('🧊 RECEIVER ICE gathering state:', pc.iceGatheringState);
  });

  pc.addEventListener('iceconnectionstatechange', () => {
    console.log('🧊 RECEIVER ICE connection state:', pc.iceConnectionState);
  });

  // IMPORTANT: Setup datachannel listener BEFORE setRemoteDescription
  // Create promise that resolves when datachannel is received
  let dataChannelResolver: (channel: RTCDataChannel) => void;
  const dataChannelPromise = new Promise<RTCDataChannel>((resolve) => {
    dataChannelResolver = resolve;
  });

  console.log('🔧 RECEIVER: Setting up datachannel listener BEFORE setRemoteDescription...');
  pc.addEventListener('datachannel', (event) => {
    console.log('📡 QR-Connect RECEIVER: Data channel received IN processQRConnectOffer!');
    console.log('   - label:', event.channel.label);
    console.log('   - readyState:', event.channel.readyState);
    console.log('   - id:', event.channel.id);

    // Resolve the promise with the datachannel
    dataChannelResolver(event.channel);
  });

  // Set remote description from QR code
  await pc.setRemoteDescription(new RTCSessionDescription(offerData.offer));

  // Create answer
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  // Wait for ICE gathering (or timeout for TURN candidates)
  await new Promise<void>((resolve) => {
    if (pc.iceGatheringState === 'complete') {
      console.log('✅ RECEIVER ICE gathering already complete');
      resolve();
    } else {
      const checkState = () => {
        console.log(`🧊 RECEIVER ICE gathering state changed to: ${pc.iceGatheringState}`);
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', checkState);
          console.log('✅ RECEIVER ICE gathering complete - all candidates collected');
          resolve();
        }
      };
      pc.addEventListener('icegatheringstatechange', checkState);

      // Timeout after 10 seconds (increased from 5s to allow TURN candidates)
      setTimeout(() => {
        pc.removeEventListener('icegatheringstatechange', checkState);
        console.log(`⚠️ RECEIVER ICE gathering timeout after 10s - state: ${pc.iceGatheringState}`);
        console.log(`   Trickle ICE will continue sending candidates...`);
        resolve();
      }, 10000);
    }
  });

  // Create answer data
  const answerData: QRConnectAnswer = {
    type: 'clevrsend-qr-answer',
    peerId: crypto.randomUUID(),
    answer: pc.localDescription!.toJSON()
  };

  const answerString = JSON.stringify(answerData);

  return {
    peerId: offerData.peerId,
    peerAlias: offerData.peerAlias,
    senderId: offerData.senderId, // Return senderId for answer routing
    pc,
    answer: answerString,
    dataChannelPromise // Return promise that resolves when datachannel is received
  };
}

/**
 * Complete connection by processing answer (for sender)
 */
export async function completeQRConnection(
  pc: RTCPeerConnection,
  answerData: string
): Promise<void> {
  const answer: QRConnectAnswer = JSON.parse(answerData);

  if (answer.type !== 'clevrsend-qr-answer') {
    throw new Error('Invalid answer data');
  }

  await pc.setRemoteDescription(new RTCSessionDescription(answer.answer));
}

/**
 * Send files over QR-Connect data channel
 */
export async function sendFilesViaQRConnect(
  dataChannel: RTCDataChannel,
  files: File[],
  onProgress?: (progress: { fileIndex: number; fileName: string; sent: number; total: number }) => void
): Promise<void> {
  if (dataChannel.readyState !== 'open') {
    throw new Error(`Data channel not ready. State: ${dataChannel.readyState}`);
  }

  console.log('📤 Starting QR-Connect file transfer...');
  console.log(`   - Files to send: ${files.length}`);
  console.log(`   - Channel state: ${dataChannel.readyState}`);

  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const file = files[fileIndex];
    console.log(`📄 Sending file ${fileIndex + 1}/${files.length}: ${file.name} (${file.size} bytes)`);

    // Send file metadata first
    const metadata = {
      type: 'file-start',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileIndex,
      totalFiles: files.length
    };

    dataChannel.send(JSON.stringify(metadata));
    console.log('   - Metadata sent');

    // Read and send file in chunks
    const chunkSize = 16384; // 16 KB chunks
    const reader = new FileReader();
    let offset = 0;

    while (offset < file.size) {
      const slice = file.slice(offset, offset + chunkSize);
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(slice);
      });

      // Wait for buffer to drain if needed
      while (dataChannel.bufferedAmount > chunkSize * 4) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      dataChannel.send(arrayBuffer);
      offset += arrayBuffer.byteLength;

      if (onProgress) {
        onProgress({
          fileIndex,
          fileName: file.name,
          sent: offset,
          total: file.size
        });
      }
    }

    // Send file-end marker
    const endMarker = {
      type: 'file-end',
      fileName: file.name,
      fileIndex
    };
    dataChannel.send(JSON.stringify(endMarker));

    console.log(`✅ File sent: ${file.name}`);
  }

  // Send transfer-complete marker
  const completeMarker = {
    type: 'transfer-complete',
    totalFiles: files.length
  };
  dataChannel.send(JSON.stringify(completeMarker));

  console.log('✅ QR-Connect file transfer complete!');
}

/**
 * Setup event listeners for P2P connection
 */
export function setupQRConnectionListeners(
  pc: RTCPeerConnection,
  callbacks: {
    onConnected?: () => void;
    onDisconnected?: () => void;
    onDataChannel?: (channel: RTCDataChannel) => void;
    onError?: (error: Error) => void;
    onFailed?: () => void;
  }
) {
  let hasConnected = false;
  let iceRestartAttempts = 0;
  const maxIceRestarts = 2;

  // Add reconnection timer to handle transient disconnections
  let reconnectionTimer: NodeJS.Timeout | null = null;

  pc.addEventListener('connectionstatechange', () => {
    console.log('QR-Connect: Connection state:', pc.connectionState);

    if (pc.connectionState === 'connected') {
      hasConnected = true;
      iceRestartAttempts = 0;
      // Clear any pending reconnection timer
      if (reconnectionTimer) {
        clearTimeout(reconnectionTimer);
        reconnectionTimer = null;
      }
      callbacks.onConnected?.();
    } else if (pc.connectionState === 'disconnected') {
      // Wait a bit before treating as error - connection might recover
      console.log('⚠️ Connection disconnected, waiting 3s before reconnect attempt...');

      if (reconnectionTimer) {
        clearTimeout(reconnectionTimer);
      }

      reconnectionTimer = setTimeout(() => {
        // Check if still disconnected after timeout
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          if (iceRestartAttempts < maxIceRestarts) {
            console.log(`🔄 Still disconnected after 3s, attempting ICE restart ${iceRestartAttempts + 1}/${maxIceRestarts}`);
            iceRestartAttempts++;
            callbacks.onError?.(new Error(`Verbindung unterbrochen, Wiederverbindung ${iceRestartAttempts}/${maxIceRestarts}...`));
          } else {
            console.log('❌ Max ICE restart attempts reached, giving up');
            callbacks.onDisconnected?.();
          }
        }
      }, 3000);
    } else if (pc.connectionState === 'failed') {
      // Clear any pending reconnection timer
      if (reconnectionTimer) {
        clearTimeout(reconnectionTimer);
        reconnectionTimer = null;
      }

      if (iceRestartAttempts < maxIceRestarts) {
        console.log(`🔄 Connection failed, attempting reconnect ${iceRestartAttempts + 1}/${maxIceRestarts}`);
        iceRestartAttempts++;
        callbacks.onError?.(new Error(`Verbindungsaufbau fehlgeschlagen, Versuch ${iceRestartAttempts}/${maxIceRestarts}...`));
      } else {
        console.log('❌ Max reconnect attempts reached, connection failed');
        callbacks.onFailed?.();
        callbacks.onDisconnected?.();
      }
    }
  });

  // Listen for data channel from remote peer
  console.log('🔧 RECEIVER: Setting up datachannel listener...');
  pc.addEventListener('datachannel', (event) => {
    console.log('📡 QR-Connect RECEIVER: Data channel received!');
    console.log('   - label:', event.channel.label);
    console.log('   - readyState:', event.channel.readyState);
    console.log('   - id:', event.channel.id);
    console.log('   - Peer connection state:', pc.connectionState);
    console.log('   - ICE connection state:', pc.iceConnectionState);

    // Setup event listeners for the received channel
    event.channel.addEventListener('open', () => {
      console.log('✅ QR-Connect RECEIVER: Data channel OPEN - Ready to receive files');
      console.log('   - readyState:', event.channel.readyState);
      console.log('   - bufferedAmount:', event.channel.bufferedAmount);
    });

    event.channel.addEventListener('close', () => {
      console.log('❌ QR-Connect RECEIVER: Data channel CLOSED');
    });

    event.channel.addEventListener('error', (error) => {
      console.error('❌ QR-Connect RECEIVER: Data channel ERROR:', error);
    });

    event.channel.addEventListener('message', (evt) => {
      console.log('📨 QR-Connect RECEIVER: Received message, size:', evt.data?.byteLength || evt.data?.length || 'unknown');
    });

    callbacks.onDataChannel?.(event.channel);
  });
  console.log('🔧 RECEIVER: Datachannel listener set up!');

  // Additional error handling for ICE failures
  const originalIceListener = pc.oniceconnectionstatechange;
  pc.addEventListener('iceconnectionstatechange', () => {
    if (pc.iceConnectionState === 'failed') {
      console.error('❌ ICE Connection FAILED - NAT traversal problem!');
      callbacks.onError?.(new Error('ICE connection failed'));
    } else if (pc.iceConnectionState === 'connected') {
      console.log('✅ ICE Connection SUCCESSFUL!');
    } else if (pc.iceConnectionState === 'disconnected') {
      console.log('⚠️ ICE Connection DISCONNECTED');
    }
  });
}

/**
 * Add received ICE candidate to PeerConnection (Trickle ICE)
 */
export async function addIceCandidate(
  pc: RTCPeerConnection,
  candidate: RTCIceCandidateInit
): Promise<void> {
  try {
    console.log('📥 Adding received ICE candidate:', candidate.candidate?.substring(0, 50) + '...');
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('✅ ICE candidate added successfully');
  } catch (error) {
    console.error('❌ Error adding ICE candidate:', error);
    // Don't throw - some candidates may fail, which is normal
  }
}
