/**
 * QR-Connect File Transfer
 * Simplified file transfer over an already established DataChannel
 */

const CHUNK_SIZE = 16 * 1024; // 16KB chunks

export interface QRFileTransferProgress {
  fileId: string;
  fileName: string;
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}

export interface QRFileTransferOptions {
  dataChannel: RTCDataChannel;
  files: FileList;
  onProgress: (progress: QRFileTransferProgress) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

/**
 * Send files over an existing QR-Connect DataChannel
 */
export async function sendFilesViaQRConnect(options: QRFileTransferOptions) {
  const { dataChannel, files, onProgress, onComplete, onError } = options;

  console.log(`📤 QR File Transfer: Starting transfer of ${files.length} file(s)`);

  // Check if data channel is open
  if (dataChannel.readyState !== 'open') {
    const error = new Error('DataChannel is not open');
    onError(error);
    throw error;
  }

  try {
    // Send file metadata first
    const fileMetadata = Array.from(files).map((file, index) => ({
      id: index.toString(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    dataChannel.send(JSON.stringify({
      type: 'FILE_METADATA',
      files: fileMetadata,
    }));

    console.log('📋 Sent file metadata:', fileMetadata);

    // Send each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = i.toString();

      console.log(`📄 Sending file ${i + 1}/${files.length}: ${file.name} (${file.size} bytes)`);

      await sendFile(dataChannel, file, fileId, (progress) => {
        onProgress({
          fileId,
          fileName: file.name,
          bytesTransferred: progress,
          totalBytes: file.size,
          percentage: Math.round((progress / file.size) * 100),
        });
      });
    }

    // Send completion signal
    dataChannel.send(JSON.stringify({
      type: 'TRANSFER_COMPLETE',
    }));

    console.log('✅ All files sent successfully');
    onComplete();
  } catch (error) {
    console.error('❌ File transfer error:', error);
    onError(error as Error);
    throw error;
  }
}

/**
 * Send a single file in chunks
 */
async function sendFile(
  dataChannel: RTCDataChannel,
  file: File,
  fileId: string,
  onProgress: (bytesTransferred: number) => void
): Promise<void> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let offset = 0;
  let chunkIndex = 0;

  // Send file start marker
  dataChannel.send(JSON.stringify({
    type: 'FILE_START',
    fileId,
    fileName: file.name,
    fileSize: file.size,
    totalChunks,
  }));

  console.log(`  ├─ Total chunks: ${totalChunks}`);

  // Read and send file in chunks
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    const arrayBuffer = await chunk.arrayBuffer();

    // Wait if buffer is getting full
    while (dataChannel.bufferedAmount > CHUNK_SIZE * 10) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Send chunk header
    dataChannel.send(JSON.stringify({
      type: 'FILE_CHUNK',
      fileId,
      chunkIndex,
      chunkSize: arrayBuffer.byteLength,
    }));

    // Send chunk data
    dataChannel.send(arrayBuffer);

    offset += arrayBuffer.byteLength;
    chunkIndex++;

    onProgress(offset);

    if (chunkIndex % 10 === 0 || offset >= file.size) {
      console.log(`  ├─ Progress: ${offset}/${file.size} bytes (${Math.round((offset / file.size) * 100)}%)`);
    }
  }

  // Send file end marker
  dataChannel.send(JSON.stringify({
    type: 'FILE_END',
    fileId,
  }));

  console.log(`  └─ File sent: ${file.name}`);
}

/**
 * Receive files over QR-Connect DataChannel
 */
export class QRFileReceiver {
  private files: Map<string, {
    name: string;
    size: number;
    chunks: ArrayBuffer[];
    receivedBytes: number;
  }> = new Map();

  private onProgress: (fileId: string, bytesReceived: number, totalBytes: number) => void;
  private onFileComplete: (fileId: string, fileName: string, blob: Blob) => void;
  private onAllComplete: () => void;
  private onError: (error: Error) => void;

  constructor(options: {
    onProgress: (fileId: string, bytesReceived: number, totalBytes: number) => void;
    onFileComplete: (fileId: string, fileName: string, blob: Blob) => void;
    onAllComplete: () => void;
    onError: (error: Error) => void;
  }) {
    this.onProgress = options.onProgress;
    this.onFileComplete = options.onFileComplete;
    this.onAllComplete = options.onAllComplete;
    this.onError = options.onError;
  }

  /**
   * Handle incoming message from DataChannel
   */
  handleMessage(event: MessageEvent) {
    try {
      // Try to parse as JSON (control message)
      if (typeof event.data === 'string') {
        const message = JSON.parse(event.data);
        this.handleControlMessage(message);
      } else {
        // Binary data (file chunk)
        this.handleChunkData(event.data);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      this.onError(error as Error);
    }
  }

  private handleControlMessage(message: any) {
    // Ignore keep-alive ping messages
    if (message.type === 'ping' || message.type === 'pong') {
      return;
    }

    console.log('📥 Received control message:', message.type);

    switch (message.type) {
      case 'FILE_METADATA':
        console.log('📋 Received file metadata:', message.files);
        break;

      case 'FILE_START':
        this.files.set(message.fileId, {
          name: message.fileName,
          size: message.fileSize,
          chunks: [],
          receivedBytes: 0,
        });
        console.log(`📄 Starting to receive: ${message.fileName} (${message.fileSize} bytes, ${message.totalChunks} chunks)`);
        break;

      case 'FILE_CHUNK':
        // Next message will be the binary data
        this.currentChunkFileId = message.fileId;
        this.currentChunkSize = message.chunkSize;
        break;

      case 'FILE_END':
        this.finalizeFile(message.fileId);
        break;

      case 'TRANSFER_COMPLETE':
        console.log('✅ Transfer complete!');
        this.onAllComplete();
        break;
    }
  }

  private currentChunkFileId: string | null = null;
  private currentChunkSize: number = 0;

  private handleChunkData(data: ArrayBuffer) {
    if (!this.currentChunkFileId) {
      console.error('Received chunk data without FILE_CHUNK header');
      return;
    }

    const fileId = this.currentChunkFileId;
    const file = this.files.get(fileId);

    if (!file) {
      console.error(`File not found: ${fileId}`);
      return;
    }

    // Store chunk
    file.chunks.push(data);
    file.receivedBytes += data.byteLength;

    // Report progress
    this.onProgress(fileId, file.receivedBytes, file.size);

    if (file.receivedBytes % (CHUNK_SIZE * 10) === 0 || file.receivedBytes >= file.size) {
      console.log(`  ├─ Received: ${file.receivedBytes}/${file.size} bytes (${Math.round((file.receivedBytes / file.size) * 100)}%)`);
    }

    // Reset current chunk
    this.currentChunkFileId = null;
    this.currentChunkSize = 0;
  }

  private finalizeFile(fileId: string) {
    const file = this.files.get(fileId);

    if (!file) {
      console.error(`Cannot finalize file: ${fileId} not found`);
      return;
    }

    console.log(`  └─ Finalizing file: ${file.name}`);

    // Combine all chunks into a Blob
    const blob = new Blob(file.chunks);

    // Trigger callback
    this.onFileComplete(fileId, file.name, blob);

    // Cleanup
    this.files.delete(fileId);
  }
}
