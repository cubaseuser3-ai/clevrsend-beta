<template>
  <div class="qr-scanner-container">
    <div class="qr-scanner-modal" @click.self="$emit('close')">
      <div class="qr-scanner-content">
        <div class="qr-scanner-header">
          <h3 class="text-xl font-bold">QR-Code scannen</h3>
          <button @click="$emit('close')" class="close-button">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>

        <div class="qr-scanner-video-container">
          <video ref="videoElement" class="qr-scanner-video" autoplay playsinline></video>
          <div class="qr-scanner-overlay">
            <div class="qr-scanner-frame"></div>
          </div>
        </div>

        <p class="qr-scanner-hint">Halte den QR-Code vor die Kamera</p>

        <div v-if="error" class="qr-scanner-error">
          <Icon name="mdi:alert-circle" size="20" />
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import jsQR from 'jsqr';

const emit = defineEmits<{
  close: [];
  scanned: [data: string];
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const error = ref<string | null>(null);
let stream: MediaStream | null = null;
let scanningInterval: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  try {
    // Request camera access
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // Use back camera on mobile
    });

    if (videoElement.value) {
      videoElement.value.srcObject = stream;

      // Start scanning
      videoElement.value.addEventListener('loadedmetadata', () => {
        startScanning();
      });
    }
  } catch (err) {
    console.error('Camera access error:', err);
    error.value = 'Kamerazugriff verweigert. Bitte erlaube den Kamerazugriff.';
  }
});

onUnmounted(() => {
  stopScanning();
});

function startScanning() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  scanningInterval = setInterval(() => {
    if (videoElement.value && ctx) {
      canvas.width = videoElement.value.videoWidth;
      canvas.height = videoElement.value.videoHeight;

      ctx.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        // QR code detected
        console.log('QR Code detected:', code.data);
        emit('scanned', code.data);
        stopScanning();
      }
    }
  }, 300); // Scan every 300ms
}

function stopScanning() {
  if (scanningInterval) {
    clearInterval(scanningInterval);
    scanningInterval = null;
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}
</script>

<style scoped>
.qr-scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
}

.qr-scanner-modal {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.qr-scanner-content {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
}

.qr-scanner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.qr-scanner-video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.qr-scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-scanner-frame {
  width: 70%;
  height: 70%;
  border: 3px solid rgba(34, 197, 94, 0.8);
  border-radius: 1rem;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}

.qr-scanner-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.qr-scanner-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: rgb(248, 113, 113);
}
</style>
