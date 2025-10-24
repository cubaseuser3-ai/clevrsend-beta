<template>
  <div class="dark:text-white flex flex-col h-screen relative">
    <DarkVeilBackground
      :hue-shift="animationSettings.hueShift"
      :noise-intensity="animationSettings.noiseIntensity"
      :scanline-intensity="animationSettings.scanlineIntensity"
      :speed="animationSettings.speed"
      :scanline-frequency="animationSettings.scanlineFrequency"
      :warp-amount="animationSettings.warpAmount"
      :resolution-scale="0.6"
    />
    <div class="flex items-center justify-between gap-4 mt-4 px-4 relative z-10">
      <div class="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="ClevrSend Logo"
          class="h-11 w-11 logo-white"
        />
        <div class="flex flex-col gap-0" style="margin-left: -10px;">
          <BlurText
            text="ClevrSend"
            :delay="100"
            animate-by="characters"
            direction="top"
            class-name="text-4xl font-bold tracking-tight blur-text-title"
          />
          <BlurText
            text="powered by MyTech"
            :delay="50"
            animate-by="characters"
            direction="top"
            class-name="powered-by"
          />
        </div>
      </div>
      <div class="flex items-center gap-6">
        <div class="airdrop-tagline">
          Die AirDrop-Alternative für alle Geräte
        </div>
        <button
          @click="showShareDialog = !showShareDialog"
          class="share-button"
          title="Link teilen"
        >
          <Icon name="mdi:share-variant" size="24" />
        </button>
        <button
          @click="showSettings = !showSettings"
          class="settings-button"
          title="Animation Einstellungen"
        >
          <Icon name="mdi:cog" size="24" />
        </button>
      </div>
    </div>

    <!-- Mode Tabs -->
    <div class="mode-tabs-container relative z-10">
      <div class="mode-tabs">
        <button
          @click="activeMode = 'auto'"
          :class="['mode-tab', { 'mode-tab-active': activeMode === 'auto' }]"
        >
          <Icon name="mdi:access-point-network" size="20" />
          <span>LokalSend</span>
        </button>
        <button
          @click="activeMode = 'qr'"
          :class="['mode-tab', { 'mode-tab-active': activeMode === 'qr' }]"
        >
          <Icon name="mdi:qrcode-scan" size="20" />
          <span>InternetSend</span>
        </button>
      </div>

      <!-- AirDrop Tagline for Mobile -->
      <div class="airdrop-tagline-mobile">
        Die AirDrop-Alternative für alle Geräte
      </div>

      <!-- Retry Status Indicator -->
      <div v-if="store.retryStatus.isRetrying" class="retry-status-bar">
        <div class="retry-status-content">
          <Icon name="mdi:refresh" size="18" class="retry-icon-spin" />
          <span>{{ store.retryStatus.message }}</span>
        </div>
      </div>
    </div>

    <!-- Animation Settings Panel -->
    <div v-if="showSettings" class="settings-panel relative z-20">
      <div class="settings-content">
        <div class="settings-header">
          <h3 class="text-xl font-bold">Einstellungen</h3>
          <button @click="showSettings = false" class="close-button" title="Schließen">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>

        <!-- User Info Section -->
        <div v-if="store.client" class="user-info-section">
          <div class="user-info-item">
            <span class="user-info-label">Dein Übertragungsname:</span>
            <span class="user-info-value cursor-pointer" @click="updateAlias">
              {{ store.client.alias }}
            </span>
          </div>

          <div class="user-info-divider"></div>

          <div class="user-info-item">
            <span class="user-info-label">PIN:</span>
            <span class="user-info-value cursor-pointer" @click="updatePIN">
              {{ store.pin ?? t("index.pin.none") }}
            </span>
          </div>

          <button
            @click="updatePIN"
            class="pin-button-inline"
            title="PIN ändern"
          >
            <Icon name="mdi:key" size="20" />
          </button>
        </div>

        <div class="settings-divider"></div>

        <h4 class="settings-section-title">Hintergrund Animation</h4>

        <div class="setting-item">
          <label>Geschwindigkeit: {{ animationSettings.speed.toFixed(1) }}</label>
          <input
            type="range"
            v-model.number="animationSettings.speed"
            min="0"
            max="2"
            step="0.1"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Farbverschiebung: {{ animationSettings.hueShift }}</label>
          <input
            type="range"
            v-model.number="animationSettings.hueShift"
            min="-180"
            max="180"
            step="1"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Rausch-Intensität: {{ animationSettings.noiseIntensity.toFixed(2) }}</label>
          <input
            type="range"
            v-model.number="animationSettings.noiseIntensity"
            min="0"
            max="0.5"
            step="0.01"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Scanline-Intensität: {{ animationSettings.scanlineIntensity.toFixed(2) }}</label>
          <input
            type="range"
            v-model.number="animationSettings.scanlineIntensity"
            min="0"
            max="1"
            step="0.01"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Scanline-Frequenz: {{ animationSettings.scanlineFrequency.toFixed(1) }}</label>
          <input
            type="range"
            v-model.number="animationSettings.scanlineFrequency"
            min="0"
            max="100"
            step="1"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Warp-Stärke: {{ animationSettings.warpAmount.toFixed(2) }}</label>
          <input
            type="range"
            v-model.number="animationSettings.warpAmount"
            min="0"
            max="2"
            step="0.01"
            class="slider"
          />
        </div>

        <button @click="resetSettings" class="reset-button">
          Zurücksetzen
        </button>

        <div class="settings-divider"></div>

        <h4 class="settings-section-title">Design Einstellungen</h4>

        <div class="setting-item">
          <label>Peer-Karten Farbe (Hue): {{ designSettings.peerCardHue }}</label>
          <input
            type="range"
            v-model.number="designSettings.peerCardHue"
            min="0"
            max="360"
            step="1"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Peer-Karten Sättigung: {{ designSettings.peerCardSaturation }}%</label>
          <input
            type="range"
            v-model.number="designSettings.peerCardSaturation"
            min="0"
            max="100"
            step="1"
            class="slider"
          />
        </div>

        <div class="setting-item">
          <label>Peer-Karten Helligkeit: {{ designSettings.peerCardLightness }}%</label>
          <input
            type="range"
            v-model.number="designSettings.peerCardLightness"
            min="0"
            max="100"
            step="1"
            class="slider"
          />
        </div>

        <button @click="resetDesignSettings" class="reset-button">
          Design Zurücksetzen
        </button>
      </div>
    </div>

    <!-- Share Dialog -->
    <div v-if="showShareDialog" class="share-dialog relative z-20">
      <div class="share-dialog-content">
        <div class="share-header">
          <h3 class="text-xl font-bold">Link Teilen</h3>
          <button @click="showShareDialog = false" class="close-button" title="Schließen">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>

        <div class="share-url-section">
          <input
            type="text"
            :value="shareUrl"
            readonly
            class="share-url-input"
            @click="copyToClipboard"
          />
          <button @click="copyToClipboard" class="copy-button" title="Kopieren">
            <Icon name="mdi:content-copy" size="20" />
          </button>
        </div>

        <div class="share-channels">
          <h4 class="share-channels-title">Teilen über:</h4>
          <div class="share-buttons-grid">
            <button @click="shareVia('whatsapp')" class="share-channel-button whatsapp">
              <Icon name="mdi:whatsapp" size="24" />
              <span>WhatsApp</span>
            </button>
            <button @click="shareVia('telegram')" class="share-channel-button telegram">
              <Icon name="mdi:telegram" size="24" />
              <span>Telegram</span>
            </button>
            <button @click="shareVia('email')" class="share-channel-button email">
              <Icon name="mdi:email" size="24" />
              <span>E-Mail</span>
            </button>
            <button @click="shareVia('twitter')" class="share-channel-button twitter">
              <Icon name="mdi:twitter" size="24" />
              <span>Twitter</span>
            </button>
            <button @click="shareVia('facebook')" class="share-channel-button facebook">
              <Icon name="mdi:facebook" size="24" />
              <span>Facebook</span>
            </button>
            <button @click="shareVia('qr')" class="share-channel-button qr">
              <Icon name="mdi:qrcode" size="24" />
              <span>QR Code</span>
            </button>
          </div>
        </div>

        <!-- QR Code Display -->
        <div v-if="showQrCode" class="qr-code-section">
          <canvas ref="qrCodeCanvas" class="qr-code-canvas"></canvas>
          <p class="qr-code-hint">Scannen Sie den QR-Code, um die Seite zu öffnen</p>
        </div>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div v-if="showQrCodeModal" class="qr-code-modal-overlay z-30" @click="showQrCodeModal = false">
      <div class="qr-code-modal" @click.stop>
        <div class="qr-code-modal-header">
          <h3 class="text-2xl font-bold">QR Code scannen</h3>
          <button @click="showQrCodeModal = false" class="close-button" title="Schließen">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>

        <div class="qr-code-modal-content">
          <div class="qr-code-display">
            <canvas ref="qrCodeModalCanvas" class="qr-code-canvas-large"></canvas>
          </div>
          <p class="qr-code-modal-hint">
            Scannen Sie diesen QR-Code mit Ihrem Smartphone, um ClevrSend zu öffnen
          </p>
          <div class="qr-code-url-display">
            <input
              type="text"
              :value="shareUrl"
              readonly
              class="qr-url-input"
            />
            <button @click="copyToClipboard" class="copy-button-small" title="Kopieren">
              <Icon name="mdi:content-copy" size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom PIN Dialog -->
    <div v-if="showPinDialog" class="pin-dialog-overlay relative z-40" @click="cancelPinDialog">
      <div class="pin-dialog" @click.stop>
        <div class="pin-dialog-header">
          <h3 class="text-xl font-bold">{{ pinDialogTitle }}</h3>
          <button @click="cancelPinDialog" class="close-button" title="Abbrechen">
            <Icon name="mdi:close" size="24" />
          </button>
        </div>

        <div class="pin-dialog-content">
          <input
            v-model="pinDialogInput"
            type="text"
            class="pin-dialog-input"
            placeholder="Eingabe..."
            @keyup.enter="submitPinDialog"
            @keyup.esc="cancelPinDialog"
            autofocus
          />
          <div class="pin-dialog-buttons">
            <button @click="cancelPinDialog" class="pin-dialog-button pin-dialog-button-cancel">
              Abbrechen
            </button>
            <button @click="submitPinDialog" class="pin-dialog-button pin-dialog-button-submit">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- QR-Connect Mode -->
    <div v-if="activeMode === 'qr'" class="flex-1 px-4 py-8 relative z-10 overflow-y-auto">
      <div class="qr-connect-container">
        <div class="qr-connect-header">
          <h2 class="text-2xl font-bold">🔗 Schnellverbindung via QR-Code</h2>
          <p class="qr-connect-description">
            Verbinde zwei Geräte direkt über QR-Code - funktioniert überall über Internet!
          </p>
        </div>

        <!-- Connection Status -->
        <div v-if="qrConnectionStatus" class="qr-connection-status">
          <div :class="['status-indicator', qrConnectionStatus.type]">
            <Icon :name="qrConnectionStatus.icon" size="24" />
            <span>{{ qrConnectionStatus.message }}</span>
          </div>
        </div>

        <!-- File Upload Button (shown when connection is ready) -->
        <div v-if="qrDataChannel && qrDataChannel.readyState === 'open'" class="qr-file-upload-section">
          <button @click="openQrFileDialog" class="qr-file-upload-button">
            <Icon name="mdi:file-upload" size="32" />
            <span>Dateien senden</span>
          </button>
          <p class="qr-file-upload-hint">Klicke hier, um Dateien über QR-Connect zu senden</p>
        </div>

        <!-- QR Send Section -->
        <div class="qr-connect-section">
          <h3 class="qr-section-title">
            <Icon name="mdi:upload" size="24" />
            Dateien senden
          </h3>
          <p class="qr-section-hint">Zeige den QR-Code dem Empfänger</p>

          <div v-if="!showQrSendCode" class="qr-action-button-container">
            <button @click="generateQrSendCode" class="qr-action-button qr-button-primary">
              <Icon name="mdi:qrcode" size="32" />
              <span>QR-Code anzeigen</span>
            </button>
          </div>

          <div v-else class="qr-code-display-container">
            <!-- Loading State -->
            <div v-if="qrCodeGenerating" class="qr-loading">
              <div class="qr-loading-spinner"></div>
              <p class="qr-loading-text">QR-Code wird generiert...</p>
            </div>

            <!-- QR Code - Simple and Clean -->
            <div v-else class="qr-code-wrapper">
              <div class="qr-code-box">
                <canvas ref="qrSendCanvas" class="qr-canvas"></canvas>
              </div>

              <div class="qr-actions">
                <button @click="copyQrLink" class="qr-action-btn qr-copy">
                  <Icon name="mdi:content-copy" size="20" />
                  <span>Link kopieren</span>
                </button>
                <button @click="showQrSendCode = false" class="qr-action-btn qr-close">
                  <Icon name="mdi:close" size="20" />
                  <span>Schließen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="qr-connect-divider"></div>

        <!-- QR Receive Section -->
        <div class="qr-connect-section">
          <h3 class="qr-section-title">
            <Icon name="mdi:download" size="24" />
            Dateien empfangen
          </h3>
          <p class="qr-section-hint">Scanne den QR-Code des Senders</p>

          <!-- Show scan button if not showing answer -->
          <div v-if="!showQrAnswerCode" class="qr-action-button-container">
            <button @click="startQrScan" class="qr-action-button qr-button-secondary">
              <Icon name="mdi:camera" size="32" />
              <span>QR-Code scannen</span>
            </button>
          </div>

          <!-- Show answer QR code after scanning -->
          <div v-else class="qr-code-display-container">
            <div class="qr-code-wrapper">
              <div class="qr-code-box">
                <canvas ref="qrAnswerCanvas" class="qr-canvas"></canvas>
              </div>

              <div class="qr-actions">
                <button @click="copyAnswerLink" class="qr-action-btn qr-copy">
                  <Icon name="mdi:content-copy" size="20" />
                  <span>Link kopieren</span>
                </button>
                <button @click="showQrAnswerCode = false" class="qr-action-btn qr-close">
                  <Icon name="mdi:close" size="20" />
                  <span>Schließen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="qr-connect-info">
          <Icon name="mdi:information" size="20" />
          <div class="qr-info-text">
            <strong>Hinweis:</strong> Die Verbindung erfolgt direkt zwischen den Geräten (P2P).
            Funktioniert auch wenn beide Geräte in verschiedenen Netzwerken sind!
          </div>
        </div>
      </div>
    </div>

    <!-- Automatic Mode (Original) -->
    <div v-else-if="activeMode === 'auto'">
      <div
        v-if="!store.signaling"
        class="flex-1 flex flex-col items-center justify-center text-center px-2 relative z-10"
      >
        <h3 v-if="minDelayFinished" class="text-3xl">
          {{
            webCryptoSupported
              ? t("index.connecting")
              : t("index.webCryptoNotSupported")
          }}
        </h3>
      </div>

      <!-- Empty State: Own Card + Waiting Card -->
      <div
        v-else-if="store.peers.length === 0"
        class="flex-1 px-4 py-8 relative z-10 overflow-y-auto"
      >
        <MagicBento :items="emptyStateItems">
          <template v-slot:card-0>
            <!-- Eigene Karte - Empty State -->
            <div
              v-if="store.client"
              class="peer-card-content own-card"
            >
              <div class="card-type-badge own-card-badge">
                <Icon name="mdi:send" size="14" />
                <span>Sender</span>
              </div>

              <div class="own-card-user-info">
                <div class="own-card-info-item">
                  <span class="own-card-label">Dein Übertragungsname:</span>
                  <span class="own-card-value cursor-pointer" @click="updateAlias">
                    {{ store.client.alias }}
                  </span>
                </div>

                <div class="own-card-divider"></div>

                <div class="own-card-info-item">
                  <span class="own-card-label">PIN:</span>
                  <span class="own-card-value cursor-pointer" @click="updatePIN">
                    {{ store.pin ?? t("index.pin.none") }}
                  </span>
                </div>

                <button
                  @click="updatePIN"
                  class="own-card-pin-button"
                  title="PIN ändern"
                >
                  <Icon name="mdi:key" size="24" />
                </button>
              </div>

              <p class="own-card-device text-sm opacity-60 mt-4">
                {{ store.client.deviceModel }}
              </p>
            </div>
          </template>

          <template v-slot:card-1>
            <!-- Warte-Karte -->
            <div class="peer-card-content waiting-card">
              <div class="waiting-card-icon">
                <Icon name="mdi:radar" size="64" class="radar-icon" />
              </div>
              <div class="waiting-card-text">
                <h3 class="waiting-card-title">Warte auf Geräte...</h3>
                <p class="waiting-card-hint">{{ t("index.empty.deviceHint") }}</p>
                <p class="waiting-card-hint">{{ t("index.empty.lanHint") }}</p>
              </div>
              <div class="waiting-card-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </template>
        </MagicBento>
      </div>

      <div v-else class="flex-1 px-4 py-8 relative z-10 overflow-y-auto">
      <MagicBento :items="allItems">
        <template v-for="(item, index) in allItems" :key="index" v-slot:[`card-${index}`]="{ item: slotItem }">
          <!-- Eigene Karte -->
          <div
            v-if="index === 0 && store.client"
            class="peer-card-content own-card"
          >
            <div class="card-type-badge own-card-badge">
              <Icon name="mdi:send" size="14" />
              <span>Sender</span>
            </div>

            <div class="own-card-user-info">
              <div class="own-card-info-item">
                <span class="own-card-label">Dein Übertragungsname:</span>
                <span class="own-card-value cursor-pointer" @click="updateAlias">
                  {{ store.client.alias }}
                </span>
              </div>

              <div class="own-card-divider"></div>

              <div class="own-card-info-item">
                <span class="own-card-label">PIN:</span>
                <span class="own-card-value cursor-pointer" @click="updatePIN">
                  {{ store.pin ?? t("index.pin.none") }}
                </span>
              </div>

              <button
                @click="updatePIN"
                class="own-card-pin-button"
                title="PIN ändern"
              >
                <Icon name="mdi:key" size="24" />
              </button>
            </div>

            <p class="own-card-device text-sm opacity-60 mt-4">
              {{ store.client.deviceModel }}
            </p>
          </div>

          <!-- Peer Karten -->
          <div
            v-else-if="index > 0"
            class="peer-card-content peer-card-with-spotlight"
            :class="{ 'drag-over': draggedPeer === store.peers[index - 1]?.id }"
            @click="selectPeer(store.peers[index - 1].id)"
            @dragenter="handleDragEnter(store.peers[index - 1].id)"
            @dragover="handleDragOver($event, store.peers[index - 1].id)"
            @dragleave="handleDragLeave(store.peers[index - 1].id)"
            @drop="handleDrop($event, store.peers[index - 1].id)"
            @mousemove="handlePeerCardMouseMove($event, index)"
            :ref="el => setPeerCardRef(el, index)"
          >
            <!-- Spotlight effect overlay -->
            <div
              class="peer-spotlight-overlay"
              :style="getPeerSpotlightStyle(index)"
            ></div>
            <div class="card-type-badge peer-card-badge">
              <Icon name="mdi:download" size="14" />
              <span>Empfänger</span>
            </div>

            <div class="peer-upload-section">
              <button class="upload-button">
                <Icon name="mdi:plus" size="32" />
              </button>
              <p class="upload-text">Klicken, um Ihre Dateien hinzuzufügen</p>
            </div>

            <div v-if="draggedPeer === store.peers[index - 1]?.id" class="drop-indicator">
              <Icon name="mdi:cloud-upload" size="48" />
              <p class="mt-2 text-lg font-semibold">Dateien hier ablegen</p>
            </div>
          </div>
        </template>
      </MagicBento>
      </div>
    </div>

    <SessionDialog class="relative z-20" />

    <!-- QR Scanner -->
    <QrScanner
      v-if="showQrScanner"
      @close="showQrScanner = false"
      @scanned="handleQrScanned"
    />

    <!-- Version & Status Info -->
    <div class="version-info">
      <!-- Frontend Status -->
      <div class="status-row">
        <div class="status-indicator-small success">
          <Icon name="mdi:check-circle" size="12" />
        </div>
        <div class="status-details">
          <div class="version-item">
            <span class="version-label">Frontend:</span>
            <span class="version-value">v{{ appVersion }}</span>
          </div>
          <div class="status-time" v-if="frontendStartTime">
            Ready seit {{ frontendStartTime }}
          </div>
        </div>
      </div>

      <!-- Backend Status -->
      <div class="status-row" v-if="backendVersion">
        <div class="status-indicator-small success">
          <Icon name="mdi:check-circle" size="12" />
        </div>
        <div class="status-details">
          <div class="version-item">
            <span class="version-label">Backend:</span>
            <span class="version-value">v{{ backendVersion }}</span>
          </div>
          <div class="status-time" v-if="backendUptime">
            Ready seit {{ backendUptime }}
          </div>
        </div>
      </div>

      <!-- Version Mismatch Warning -->
      <div class="version-mismatch-warning" v-if="versionMismatch">
        <Icon name="mdi:alert" size="14" />
        <span>Version-Konflikt erkannt!</span>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['toast', `toast-${notification.type}`]"
        >
          <Icon :name="notification.icon" size="20" />
          <span>{{ notification.message }}</span>
        </div>
      </transition-group>
    </div>

    <!-- Legal Footer -->
    <footer class="legal-footer">
      <div class="legal-links">
        <NuxtLink to="/impressum" class="legal-link">Impressum</NuxtLink>
        <span class="legal-separator">|</span>
        <NuxtLink to="/datenschutz" class="legal-link">Datenschutz</NuxtLink>
        <span class="legal-separator">|</span>
        <NuxtLink to="/agb" class="legal-link">AGB</NuxtLink>
      </div>
      <div class="legal-copyright">
        © {{ new Date().getFullYear() }} MyTech Support GmbH
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  setupConnection,
  setupQRSignaling,
  startSendSession,
  store,
  updateAliasState,
  SessionState,
} from "@/services/store";
import { PeerDeviceType } from "@/services/signaling";
import { getAgentInfoString } from "~/utils/userAgent";
import { protocolVersion } from "~/services/webrtc";
import { generateRandomAlias } from "~/utils/alias";
import { useFileDialog } from "@vueuse/core";
import SessionDialog from "~/components/dialog/SessionDialog.vue";
import QrScanner from "~/components/QrScanner.vue";
import {
  cryptoKeyToPem,
  generateClientTokenFromCurrentTimestamp,
  generateKeyPair,
  isWebCryptoSupported,
  upgradeToEd25519IfSupported,
} from "~/services/crypto";
import {
  generateQRConnectOffer,
  processQRConnectOffer,
  completeQRConnection,
  setupQRConnectionListeners,
  addIceCandidate,
  type QRConnectOffer,
} from "~/services/qr-connect";
import {
  sendFilesViaQRConnect,
  QRFileReceiver,
  type QRFileTransferProgress,
} from "~/services/qr-file-transfer";
import {
  logApp,
  logInteraction,
  logQR,
  logWebRTC,
  logSignaling,
  logFile,
  logError,
} from "~/utils/logger";

definePageMeta({
  title: "index.seo.title",
  description: "index.seo.description",
});

const { t } = useI18n();

const { open: openFileDialog, onChange } = useFileDialog();

// Animation settings state
const showSettings = ref(false);
const animationSettings = ref({
  speed: 0.7,
  hueShift: -129,
  noiseIntensity: 0.00,
  scanlineIntensity: 0.00,
  scanlineFrequency: 64.0,
  warpAmount: 2.00,
});

// Design settings state
const designSettings = ref({
  peerCardHue: 258, // Purple hue (default)
  peerCardSaturation: 60,
  peerCardLightness: 50,
});

// Share dialog state
const showShareDialog = ref(false);
const showQrCode = ref(false);
const qrCodeCanvas = ref<HTMLCanvasElement | null>(null);

// Mode tabs state
const activeMode = ref<'auto' | 'qr'>('auto');

// App version (dynamically imported from package.json)
const appVersion = ref('...');
const backendVersion = ref<string | null>(null);
const versionMismatch = ref(false);
const frontendStartTime = ref<string>('');
const backendUptime = ref<string>('');

// QR-Connect state
const showQrSendCode = ref(false);
const qrSendCanvas = ref<HTMLCanvasElement | null>(null);
const qrSendUrl = ref<string>('');
const qrCodeGenerating = ref(false);
const qrAnswerCanvas = ref<HTMLCanvasElement | null>(null);
const showQrAnswerCode = ref(false);
const qrAnswerUrl = ref<string>('');
const waitingForAnswer = ref(false);
const qrConnectionStatus = ref<{
  type: 'success' | 'error' | 'info';
  icon: string;
  message: string;
} | null>(null);

// QR-Connect P2P state
const qrPeerConnection = ref<RTCPeerConnection | null>(null);
const qrDataChannel = ref<RTCDataChannel | null>(null);
const qrConnectedPeer = ref<{
  id: string;
  alias: string;
} | null>(null);
const qrFileReceiver = ref<QRFileReceiver | null>(null);

// Wake Lock to keep tab active during file transfer
let wakeLock: WakeLockSentinel | null = null;

// Request Wake Lock to prevent tab from sleeping during transfer
const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('✅ Wake Lock activated - Tab will stay active during transfer');

      wakeLock.addEventListener('release', () => {
        console.log('🔓 Wake Lock released');
      });
    } catch (err) {
      console.warn('⚠️ Wake Lock request failed:', err);
    }
  } else {
    console.log('ℹ️ Wake Lock API not supported in this browser');
  }
};

// Release Wake Lock after transfer completes
const releaseWakeLock = async () => {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('🔓 Wake Lock released after transfer');
    } catch (err) {
      console.warn('⚠️ Wake Lock release failed:', err);
    }
  }
};

// QR Code modal state
const showQrCodeModal = ref(false);
const qrCodeModalCanvas = ref<HTMLCanvasElement | null>(null);

// PIN Dialog state
const showPinDialog = ref(false);
const pinDialogTitle = ref('');
const pinDialogInput = ref('');
const pinDialogResolve = ref<((value: string | null) => void) | null>(null);

// Custom PIN dialog function
const showCustomPinDialog = (title: string = 'PIN eingeben'): Promise<string | null> => {
  return new Promise((resolve) => {
    pinDialogTitle.value = title;
    pinDialogInput.value = '';
    pinDialogResolve.value = resolve;
    showPinDialog.value = true;
  });
};

// Toast notification system
interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  icon: string;
  message: string;
}

const notifications = ref<Notification[]>([]);
let notificationIdCounter = 0;

const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  const iconMap = {
    success: 'mdi:check-circle',
    error: 'mdi:alert-circle',
    info: 'mdi:information',
    warning: 'mdi:alert',
  };

  const notification: Notification = {
    id: notificationIdCounter++,
    type,
    icon: iconMap[type],
    message,
  };

  notifications.value.push(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== notification.id);
  }, 3000);
};

const submitPinDialog = () => {
  if (pinDialogResolve.value) {
    pinDialogResolve.value(pinDialogInput.value || null);
  }
  showPinDialog.value = false;
  pinDialogInput.value = '';
};

const cancelPinDialog = () => {
  if (pinDialogResolve.value) {
    pinDialogResolve.value(null);
  }
  showPinDialog.value = false;
  pinDialogInput.value = '';
};

// Get current URL
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
});

// Track when peers were first seen (using reactive object instead of Map for better reactivity)
const peerTimestamps = ref<Record<string, number>>({});

// Load timestamps from localStorage on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('peerTimestamps');
      if (saved) {
        peerTimestamps.value = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load peer timestamps:', e);
    }
  }
});

// Save timestamps to localStorage whenever they change
watch(peerTimestamps, (timestamps) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('peerTimestamps', JSON.stringify(timestamps));
    } catch (e) {
      console.error('Failed to save peer timestamps:', e);
    }
  }
}, { deep: true });

// Update timestamps when peers change
watch(() => store.peers, (newPeers, oldPeers) => {
  // Remove timestamps for peers that are no longer in the list
  const currentPeerIds = new Set(newPeers.map(p => p.id));
  Object.keys(peerTimestamps.value).forEach(peerId => {
    if (!currentPeerIds.has(peerId) && peerId !== store.client?.id) {
      delete peerTimestamps.value[peerId];
    }
  });

  // Add timestamps for new peers
  newPeers.forEach(peer => {
    if (!(peer.id in peerTimestamps.value)) {
      // Only set timestamp for actually new peers
      const wasInOldPeers = oldPeers?.some(p => p.id === peer.id);
      if (!wasInOldPeers) {
        peerTimestamps.value[peer.id] = Date.now();
      }
    }
  });
}, { deep: true });

// Track own client timestamp
watch(() => store.client, (newClient) => {
  if (newClient && !(newClient.id in peerTimestamps.value)) {
    peerTimestamps.value[newClient.id] = Date.now();
  }
});


const resetSettings = () => {
  animationSettings.value = {
    speed: 0.4,
    hueShift: 53,
    noiseIntensity: 0.00,
    scanlineIntensity: 0.00,
    scanlineFrequency: 69.0,
    warpAmount: 1.00,
  };
};

const resetDesignSettings = () => {
  designSettings.value = {
    peerCardHue: 258,
    peerCardSaturation: 60,
    peerCardLightness: 50,
  };
};

// Copy to clipboard function
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    showNotification('Link wurde in die Zwischenablage kopiert!', 'success');
  } catch (err) {
    console.error('Failed to copy:', err);
    showNotification('Fehler beim Kopieren des Links', 'error');
  }
};

// Share via different channels
const shareVia = (channel: string) => {
  const url = encodeURIComponent(shareUrl.value);
  const text = encodeURIComponent('Schau dir ClevrSend an - Einfacher Dateitransfer!');

  let shareLink = '';

  switch (channel) {
    case 'whatsapp':
      shareLink = `https://wa.me/?text=${text}%20${url}`;
      break;
    case 'telegram':
      shareLink = `https://t.me/share/url?url=${url}&text=${text}`;
      break;
    case 'email':
      shareLink = `mailto:?subject=ClevrSend&body=${text}%20${url}`;
      break;
    case 'twitter':
      shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      break;
    case 'facebook':
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'qr':
      showQrCode.value = !showQrCode.value;
      if (showQrCode.value) {
        nextTick(() => generateQrCode());
      }
      return;
  }

  if (shareLink) {
    window.open(shareLink, '_blank');
  }
};

// Generate QR Code
const generateQrCode = async () => {
  if (!qrCodeCanvas.value) return;

  try {
    // Use qrcode library (we'll need to install it)
    const QRCode = (await import('qrcode')).default;
    await QRCode.toCanvas(qrCodeCanvas.value, shareUrl.value, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
  }
};

// Generate QR Code for modal (larger)
const generateQrCodeModal = async () => {
  if (!qrCodeModalCanvas.value) return;

  try {
    const QRCode = (await import('qrcode')).default;
    await QRCode.toCanvas(qrCodeModalCanvas.value, shareUrl.value, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
  }
};

// Watch for QR Code modal opening
watch(showQrCodeModal, (newValue) => {
  if (newValue) {
    nextTick(() => generateQrCodeModal());
  }
});

// Computed property for peer card colors
const peerCardBorderColor = computed(() => {
  return `hsla(${designSettings.value.peerCardHue}, ${designSettings.value.peerCardSaturation}%, ${designSettings.value.peerCardLightness}%, 0.5)`;
});

const peerCardGlowColor = computed(() => {
  return `hsla(${designSettings.value.peerCardHue}, ${designSettings.value.peerCardSaturation}%, ${designSettings.value.peerCardLightness}%, 0.3)`;
});

const peerCardGradientColor1 = computed(() => {
  return `hsla(${designSettings.value.peerCardHue}, ${designSettings.value.peerCardSaturation}%, ${designSettings.value.peerCardLightness}%, 0.3)`;
});

const peerCardGradientColor2 = computed(() => {
  // Slightly lighter version for gradient
  const lighterLightness = Math.min(designSettings.value.peerCardLightness + 10, 100);
  return `hsla(${designSettings.value.peerCardHue}, ${designSettings.value.peerCardSaturation}%, ${lighterLightness}%, 0.3)`;
});

// Spotlight effect for peer cards
const peerCardRefs = ref<Record<number, HTMLElement | null>>({});
const peerCardMousePositions = ref<Record<number, { x: number; y: number }>>({});

const setPeerCardRef = (el: any, index: number) => {
  if (el) {
    peerCardRefs.value[index] = el;
  }
};

const handlePeerCardMouseMove = (e: MouseEvent, index: number) => {
  const card = peerCardRefs.value[index];
  if (!card) return;

  const rect = card.getBoundingClientRect();
  peerCardMousePositions.value[index] = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const getPeerSpotlightStyle = (index: number) => {
  const pos = peerCardMousePositions.value[index];
  if (!pos) return {};

  return {
    background: `radial-gradient(circle 120px at ${pos.x}px ${pos.y}px, rgba(255, 255, 255, 0.15), transparent 80%)`,
  };
};

// Format timestamp to show date and time
const getTimeElapsed = (peerId: string) => {
  const timestamp = peerTimestamps.value[peerId];
  if (!timestamp) return 'Gerade beigetreten';

  const date = new Date(timestamp);
  const now = new Date();

  // Check if it's today
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    // Show only time if it's today
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } else {
    // Show date and time
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
};

// Get the newest peer (most recently joined)
const newestPeerId = computed(() => {
  if (store.peers.length === 0) return null;

  let newestId = store.peers[0]?.id;
  let newestTime = peerTimestamps.value[newestId] || 0;

  store.peers.forEach(peer => {
    const time = peerTimestamps.value[peer.id] || 0;
    if (time > newestTime) {
      newestTime = time;
      newestId = peer.id;
    }
  });

  return newestId;
});

// Show "Neuster Empfänger" label
const showNewestLabel = ref(false);

// Watch for changes in newest peer and show label permanently
watch(newestPeerId, (newId, oldId) => {
  if (newId && newId !== oldId && store.peers.length > 0) {
    // Show label permanently until a newer peer joins
    showNewestLabel.value = true;
  } else if (!newId || store.peers.length === 0) {
    // Hide label if no peers
    showNewestLabel.value = false;
  }
});

// Drag and drop state
const draggedPeer = ref<string | null>(null);
const dragCounter = ref<Map<string, number>>(new Map());

const handleDragEnter = (peerId: string) => {
  const count = (dragCounter.value.get(peerId) || 0) + 1;
  dragCounter.value.set(peerId, count);
  draggedPeer.value = peerId;
};

const handleDragOver = (event: DragEvent, peerId: string) => {
  event.preventDefault();
  draggedPeer.value = peerId;
};

const handleDragLeave = (peerId: string) => {
  const count = (dragCounter.value.get(peerId) || 1) - 1;
  dragCounter.value.set(peerId, count);

  if (count === 0) {
    draggedPeer.value = null;
  }
};

const handleDrop = async (event: DragEvent, peerId: string) => {
  event.preventDefault();
  draggedPeer.value = null;
  dragCounter.value.set(peerId, 0);

  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  const fileArray = Array.from(files);

  if (!store.signaling) return;

  await startSendSession({
    files: fileArray,
    targetId: peerId,
    onPin: async () => {
      return await showCustomPinDialog(t("index.enterPin"));
    },
  });
};

// Generate all bento items (own card + peer cards)
const allItems = computed(() => {
  const items = [];

  // Force reactivity by accessing peerTimestamps.value
  // This ensures the computed property re-runs when timestamps change
  const timestamps = peerTimestamps.value;

  // Eigene Karte (Orange)
  if (store.client) {
    items.push({
      title: store.client.alias,
      titleLabel: 'Dein Übertragungsname:',
      description: store.client.deviceModel,
      size: 'medium' as 'medium',
      glow: true,
      particles: true,
      isOwnCard: true,
    });
  }

  // Peer Karten (Custom color)
  store.peers.forEach((peer) => {
    items.push({
      title: peer.alias,
      titleLabel: 'Empfänger:',
      description: peer.deviceModel,
      timestamp: getTimeElapsed(peer.id),
      size: 'medium' as 'medium',
      glow: true,
      particles: true,
      isOwnCard: false,
      isNewest: peer.id === newestPeerId.value,
      showNewestLabel: peer.id === newestPeerId.value && showNewestLabel.value,
      customBorderColor: peerCardBorderColor.value,
      customGlowColor: peerCardGlowColor.value,
      customGradient1: peerCardGradientColor1.value,
      customGradient2: peerCardGradientColor2.value,
    });
  });

  return items;
});

// Generate bento items from peers
const bentoItems = computed(() => {
  return store.peers.map((peer) => ({
    title: peer.alias,
    description: peer.deviceModel,
    size: 'medium' as 'medium', // Alle Karten gleich groß
    glow: true, // Alle Karten mit Glow
    particles: true, // Alle Karten mit Partikeln
  }));
});

// Empty State Items (Own Card + Waiting Card)
const emptyStateItems = computed(() => {
  const items: any[] = [];

  // Eigene Karte
  if (store.client) {
    items.push({
      title: store.client.alias,
      titleLabel: 'Dein Übertragungsname:',
      description: store.client.deviceModel,
      size: 'medium' as 'medium',
      glow: true,
      particles: true,
      isOwnCard: true,
    });
  }

  // Warte-Karte (leeres Objekt für Slot)
  items.push({
    title: '',
    size: 'medium' as 'medium',
  });

  return items;
});

// Handle click on own card
const handleOwnCardClick = () => {
  showNotification('Du kannst dir nicht selbst Dateien schicken!', 'warning');
};

onChange(async (files) => {
  if (!files) return;

  if (files.length === 0) return;

  if (!store.signaling) return;

  // Check for large files and show warning
  const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
  const largeFileThreshold = 500 * 1024 * 1024; // 500 MB

  if (totalSize > largeFileThreshold) {
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
    showNotification(
      `⚠️ Große Datei(en): ${sizeMB} MB. Transfer kann lange dauern. Browser-Tab muss geöffnet bleiben!`,
      'warning'
    );
  }

  // Warn about individual large files
  Array.from(files).forEach(file => {
    if (file.size > largeFileThreshold) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      showNotification(
        `⚠️ "${file.name}" ist ${sizeMB} MB groß. Transfer kann mehrere Minuten dauern.`,
        'warning'
      );
    }
  });

  await startSendSession({
    files,
    targetId: targetId.value,
    onPin: async () => {
      return await showCustomPinDialog(t("index.enterPin"));
    },
  });
});

const minDelayFinished = ref(false);
const webCryptoSupported = ref(true);

const targetId = ref("");

const selectPeer = (id: string) => {
  targetId.value = id;
  openFileDialog();
};

// Setup QR File Receiver
const setupQRFileReceiver = (dataChannel: RTCDataChannel) => {
  logFile('Setting up QR File Receiver...');

  let receivingFiles = false;

  qrFileReceiver.value = new QRFileReceiver({
    onProgress: (fileId: string, bytesReceived: number, totalBytes: number) => {
      const percentage = Math.round((bytesReceived / totalBytes) * 100);
      logFile(`Receiving file ${fileId}: ${percentage}%`);

      // Initialize session state on first progress
      if (!receivingFiles) {
        receivingFiles = true;
        store.session.state = SessionState.receiving;
        store.session.curr = 0;
        store.session.total = 0; // Will be updated as files come in
        store.session.fileState = {};
      }

      // Update or create file state
      if (!store.session.fileState[fileId]) {
        store.session.fileState[fileId] = {
          id: fileId,
          name: `File ${fileId}`, // Will be updated with real name
          curr: 0,
          total: totalBytes,
          state: 'pending',
        };
        store.session.total += totalBytes;
      }

      // Update progress
      const fileState = store.session.fileState[fileId];
      if (fileState) {
        fileState.curr = bytesReceived;
        fileState.state = 'sending';

        // Update total progress
        store.session.curr = Object.values(store.session.fileState)
          .reduce((acc, file) => acc + file.curr, 0);
      }
    },
    onFileComplete: (fileId: string, fileName: string, blob: Blob) => {
      logFile(`✅ File received: ${fileName}`);

      // Update file state with real name
      const fileState = store.session.fileState[fileId];
      if (fileState) {
        fileState.name = fileName;
        fileState.state = 'finished';
        fileState.curr = fileState.total;
      }

      // Auto-download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onAllComplete: () => {
      logFile('✅ All files received!');

      // Mark all files as finished
      Object.values(store.session.fileState).forEach(file => {
        file.state = 'finished';
        file.curr = file.total;
      });
      store.session.curr = store.session.total;

      // Close dialog after 1 second
      setTimeout(() => {
        store.session.state = SessionState.idle;
        receivingFiles = false;
      }, 1000);
    },
    onError: (error: Error) => {
      logError(error, 'QR_FILE_RECEIVE');

      // Mark current file as error
      Object.values(store.session.fileState).forEach(file => {
        if (file.state === 'sending') {
          file.state = 'error';
          file.error = error.message;
        }
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        store.session.state = SessionState.idle;
        receivingFiles = false;
      }, 2000);
    },
  });

  // Listen for incoming messages
  dataChannel.addEventListener('message', (event: MessageEvent) => {
    if (qrFileReceiver.value) {
      qrFileReceiver.value.handleMessage(event);
    }
  });

  logFile('✅ QR File Receiver ready');
};

// Open file dialog for QR-Connect
const openQrFileDialog = async () => {
  logInteraction('CLICK', 'QR-Connect Dateien senden Button');
  logFile('Opening QR file dialog...');

  // Create a file input element
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const files = target.files;
    logFile(`Selected ${files.length} file(s) for QR transfer`);

    if (!qrDataChannel.value || qrDataChannel.value.readyState !== 'open') {
      logError('QR DataChannel is not open!', 'QR_FILE_UPLOAD');
      showNotification('ClevrSend Verbindung ist nicht bereit. Bitte erneut verbinden.', 'error');
      return;
    }

    // Check for large files and show warning
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    const largeFileThreshold = 500 * 1024 * 1024; // 500 MB

    if (totalSize > largeFileThreshold) {
      const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
      showNotification(
        `⚠️ Große Datei(en): ${sizeMB} MB. Transfer kann lange dauern. Browser-Tab muss geöffnet bleiben!`,
        'warning'
      );
    }

    // Warn about individual large files
    Array.from(files).forEach(file => {
      if (file.size > largeFileThreshold) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        showNotification(
          `⚠️ "${file.name}" ist ${sizeMB} MB groß. Transfer kann mehrere Minuten dauern.`,
          'warning'
        );
      }
    });

    // Initialize session state
    store.session.state = SessionState.sending;
    store.session.curr = 0;
    store.session.total = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    store.session.fileState = {};

    // Create file state for each file
    Array.from(files).forEach((file, index) => {
      store.session.fileState[index.toString()] = {
        id: index.toString(),
        name: file.name,
        curr: 0,
        total: file.size,
        state: 'pending',
      };
    });

    // Request Wake Lock to keep tab active during transfer
    await requestWakeLock();

    try {
      await sendFilesViaQRConnect({
        dataChannel: qrDataChannel.value,
        files,
        onProgress: (progress: QRFileTransferProgress) => {
          logFile(`Progress: ${progress.fileName} - ${progress.percentage}%`);

          // Update file state
          const fileState = store.session.fileState[progress.fileId];
          if (fileState) {
            fileState.curr = progress.bytesTransferred;
            fileState.state = 'sending';

            // Update total progress
            store.session.curr = Object.values(store.session.fileState)
              .reduce((acc, file) => acc + file.curr, 0);
          }
        },
        onComplete: () => {
          logFile('✅ All files transferred successfully!');

          // Mark all files as finished
          Object.values(store.session.fileState).forEach(file => {
            file.state = 'finished';
            file.curr = file.total;
          });
          store.session.curr = store.session.total;

          // Release Wake Lock after successful transfer
          releaseWakeLock();

          // Close dialog after 1 second
          setTimeout(() => {
            store.session.state = SessionState.idle;
          }, 1000);
        },
        onError: (error: Error) => {
          logError(error, 'QR_FILE_TRANSFER');

          // Mark current file as error
          Object.values(store.session.fileState).forEach(file => {
            if (file.state === 'sending') {
              file.state = 'error';
              file.error = error.message;
            }
          });

          // Release Wake Lock on error
          releaseWakeLock();

          // Close dialog after 2 seconds
          setTimeout(() => {
            store.session.state = SessionState.idle;
          }, 2000);
        },
      });
    } catch (error) {
      logError(error as Error, 'QR_FILE_UPLOAD');
      store.session.state = SessionState.idle;
      // Release Wake Lock on exception
      releaseWakeLock();
    }
  };

  input.click();
};

const updateAlias = async () => {
  if (!store.client) return;

  const current = store.client;
  if (!current) return;

  const alias = await showCustomPinDialog(t("index.enterAlias"));
  if (!alias || !store.signaling) return;

  store.signaling.send({
    type: "UPDATE",
    info: {
      alias: alias,
      version: current.version,
      deviceModel: current.deviceModel,
      deviceType: current.deviceType,
      token: current.token,
    },
  });

  updateAliasState(alias);
};

const updatePIN = async () => {
  const pin = await showCustomPinDialog(t("index.enterPin"));
  if (typeof pin === "string") {
    store.pin = pin ? pin : null;
  }
};

// QR-Connect Functions
const generateQrSendCode = async () => {
  try {
    logInteraction('CLICK', 'QR-Connect senden Button');
    logQR('🎬 START: Generate QR Send Code');

    qrCodeGenerating.value = true;

    qrConnectionStatus.value = {
      type: 'info',
      icon: 'mdi:loading',
      message: 'ClevrSend Verbindung wird vorbereitet...'
    };

    showQrSendCode.value = true;
    await nextTick();
    logQR('✅ QR Send Dialog opened');

    if (!store.client) {
      throw new Error('Client not initialized');
    }
    logQR(`Client initialized: ${store.client.alias} (${store.client.id})`);

    // Setup QR signaling connection to Render.com server
    logQR(`Setting up dedicated QR signaling connection...`);
    const qrSignaling = await setupQRSignaling();

    if (!store.qrClientId) {
      throw new Error('QR signaling client ID not available');
    }
    logQR(`✅ QR signaling connected - Client ID: ${store.qrClientId}`);

    // Generate WebRTC offer with ICE candidates (use QR client ID for answer routing)
    logWebRTC('Generating WebRTC offer...');
    const { qrData, peerId, pc, dataChannel } = await generateQRConnectOffer(
      store.client.alias,
      store.qrClientId, // Use QR client ID for answer routing
      // Trickle ICE: Send candidates as they arrive
      (candidate) => {
        logWebRTC('🧊 SENDER: Sending ICE candidate via Trickle ICE');
        const qrSignaling = store.qrSignaling;
        if (qrSignaling && store.qrConnectedPeerId) {
          qrSignaling.send({
            type: 'ICE_CANDIDATE',
            targetId: store.qrConnectedPeerId,
            candidate: candidate.toJSON()
          } as any);
          logSignaling(`✅ Sent ICE candidate to ${store.qrConnectedPeerId}`);
        }
      }
    );
    logWebRTC(`✅ Offer generated - Peer ID: ${peerId}`);

    // Store the URL for display and copying
    qrSendUrl.value = qrData;

    // Store peer connection and data channel
    qrPeerConnection.value = pc;
    qrDataChannel.value = dataChannel;

    // Keep-alive interval to maintain connection
    let keepAliveInterval: NodeJS.Timeout | null = null;

    // Setup data channel open listener to update status
    dataChannel.addEventListener('open', () => {
      console.log('🎉 QR-Connect SENDER: Channel opened in index.vue!');
      console.log('   - qrDataChannel is set:', !!qrDataChannel.value);
      console.log('   - Channel readyState:', dataChannel.readyState);
      qrConnectionStatus.value = {
        type: 'success',
        icon: 'mdi:check-circle',
        message: 'Verbindung hergestellt! Bereit für Dateitransfer'
      };

      // Scroll to top to show "Dateien senden" button
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Setup file receiver (sender can also receive files)
      setupQRFileReceiver(dataChannel);

      // Start keep-alive pings every 2 seconds (increased frequency for stability)
      keepAliveInterval = setInterval(() => {
        if (dataChannel.readyState === 'open') {
          try {
            dataChannel.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          } catch (e) {
            console.warn('Keep-alive ping failed:', e);
          }
        } else {
          if (keepAliveInterval) clearInterval(keepAliveInterval);
        }
      }, 2000);
    });

    // Clear keep-alive on close
    dataChannel.addEventListener('close', () => {
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
    });

    // Setup connection listeners
    setupQRConnectionListeners(pc, {
      onConnected: () => {
        qrConnectionStatus.value = {
          type: 'success',
          icon: 'mdi:check-circle',
          message: 'Verbindung hergestellt! Bereit für Dateitransfer'
        };
        // Scroll to top to show "Dateien senden" button
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onDisconnected: () => {
        qrConnectionStatus.value = {
          type: 'error',
          icon: 'mdi:close-circle',
          message: 'Verbindung getrennt'
        };
        qrPeerConnection.value = null;
        qrDataChannel.value = null;
      },
      onDataChannel: (channel) => {
        qrDataChannel.value = channel;
        console.log('Data channel established');
      },
      onError: (error) => {
        qrConnectionStatus.value = {
          type: 'info',
          icon: 'mdi:loading',
          message: error.message
        };
      },
      onFailed: () => {
        qrConnectionStatus.value = {
          type: 'error',
          icon: 'mdi:alert-circle',
          message: 'Verbindung fehlgeschlagen. Bitte erneut versuchen.'
        };
      }
    });

    // Stop loading state and wait for canvas to render
    qrCodeGenerating.value = false;
    await nextTick();

    // Generate QR code
    if (!qrSendCanvas.value) {
      throw new Error('Canvas element not found');
    }

    const QRCode = (await import('qrcode')).default;

    await QRCode.toCanvas(qrSendCanvas.value, qrData, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'L', // Low error correction = faster generation
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    qrConnectionStatus.value = {
      type: 'info',
      icon: 'mdi:qrcode',
      message: 'Warte auf Antwort vom Empfänger...'
    };

    // Setup callback for incoming QR_ANSWER via dedicated QR signaling server (Render.com)
    store._onQRAnswer = async (answer: string, senderId?: string) => {
      try {
        logQR('📨 Received QR_ANSWER from receiver via Render.com signaling!');
        logQR(`   - Answer data length: ${answer.length} chars`);
        logQR(`   - Receiver ID: ${senderId}`);

        // Store receiver's ID for Trickle ICE
        if (senderId) {
          store.qrConnectedPeerId = senderId;
          logQR(`✅ Stored receiver ID for Trickle ICE: ${senderId}`);
        }

        if (qrPeerConnection.value) {
          // Complete the connection with the answer
          await completeQRConnection(qrPeerConnection.value, answer);

          logQR('✅ QR-Connect completed with answer!');

          qrConnectionStatus.value = {
            type: 'success',
            icon: 'mdi:check-circle',
            message: 'Verbindung wird aufgebaut...'
          };
        }
      } catch (err) {
        logError(err as Error, 'Error handling QR_ANSWER');
      }
    };
    logQR('👂 Listening for QR_ANSWER via dedicated Render.com signaling...');

    // Setup callback for incoming ICE candidates (Trickle ICE) - SENDER side
    store._onIceCandidate = async (candidate: RTCIceCandidateInit) => {
      try {
        logWebRTC('📨 SENDER: Received ICE candidate via Trickle ICE');
        if (qrPeerConnection.value) {
          await addIceCandidate(qrPeerConnection.value, candidate);
          logWebRTC('✅ SENDER: ICE candidate added to PeerConnection');
        } else {
          logWebRTC('⚠️ SENDER: No PeerConnection available to add ICE candidate');
        }
      } catch (err) {
        logError(err as Error, 'Error adding ICE candidate (SENDER)');
      }
    };
    logQR('👂 Listening for ICE_CANDIDATE via Trickle ICE (SENDER)...');

    // Note: waitingForAnswer is NOT set to true anymore - answer comes automatically via WebSocket!
  } catch (error) {
    console.error('QR generation error:', error);
    qrConnectionStatus.value = {
      type: 'error',
      icon: 'mdi:alert-circle',
      message: `Fehler beim Generieren: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    };
    qrCodeGenerating.value = false;
  }
};

// Copy QR-Connect Link
const copyQrLink = async () => {
  try {
    await navigator.clipboard.writeText(qrSendUrl.value);
    qrConnectionStatus.value = {
      type: 'success',
      icon: 'mdi:check',
      message: 'Link wurde kopiert!'
    };

    // Reset status after 2 seconds
    setTimeout(() => {
      if (qrConnectionStatus.value?.message === 'Link wurde kopiert!') {
        qrConnectionStatus.value = {
          type: 'info',
          icon: 'mdi:qrcode',
          message: 'Lass den Empfänger scannen, dann scanne DU seinen QR-Code'
        };
      }
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    qrConnectionStatus.value = {
      type: 'error',
      icon: 'mdi:alert-circle',
      message: 'Fehler beim Kopieren'
    };
  }
};

// Copy Answer Link
const copyAnswerLink = async () => {
  try {
    await navigator.clipboard.writeText(qrAnswerUrl.value);
    qrConnectionStatus.value = {
      type: 'success',
      icon: 'mdi:check',
      message: 'Antwort-Link wurde kopiert!'
    };

    setTimeout(() => {
      if (qrConnectionStatus.value?.message === 'Antwort-Link wurde kopiert!') {
        qrConnectionStatus.value = {
          type: 'info',
          icon: 'mdi:qrcode',
          message: 'Zeige deinen QR-Code dem Sender zum Scannen'
        };
      }
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    qrConnectionStatus.value = {
      type: 'error',
      icon: 'mdi:alert-circle',
      message: 'Fehler beim Kopieren'
    };
  }
};

const showQrScanner = ref(false);

const startQrScan = async () => {
  showQrScanner.value = true;
};

const handleQrScanned = async (qrData: string) => {
  showQrScanner.value = false;
  logInteraction('QR_SCAN', 'QR-Code gescannt');
  logQR('🎬 START: Handle QR Scanned (RECEIVER)');
  logQR(`QR Data length: ${qrData.length} chars`);

  try {
    qrConnectionStatus.value = {
      type: 'info',
      icon: 'mdi:loading',
      message: 'Verbindung wird aufgebaut...'
    };

    if (!store.client) {
      throw new Error('Client not initialized');
    }
    logQR(`Receiver client: ${store.client.alias} (${store.client.id})`);

    // Note: Old two-way handshake code removed
    // Answer now comes automatically via WebSocket, not via QR scan

    // Process QR code and create answer (this is for RECEIVER only)
    logWebRTC('Processing QR offer and creating answer...');
    const { peerId, peerAlias, senderId, pc, answer, dataChannelPromise } = await processQRConnectOffer(
      qrData,
      store.client.alias,
      // Trickle ICE: Send candidates as they arrive
      (candidate) => {
        logWebRTC('🧊 RECEIVER: Sending ICE candidate via Trickle ICE');
        const qrSignaling = store.qrSignaling;
        if (qrSignaling && senderId) {
          qrSignaling.send({
            type: 'ICE_CANDIDATE',
            targetId: senderId,
            candidate: candidate.toJSON()
          } as any);
          logSignaling(`✅ Sent ICE candidate to ${senderId}`);
        }
      }
    );
    logWebRTC(`✅ Answer created for peer: ${peerAlias}`);
    logQR(`Sender ID from QR: ${senderId}`);

    // Store peer connection
    qrPeerConnection.value = pc;
    qrConnectedPeer.value = {
      id: peerId,
      alias: peerAlias
    };

    // Setup connection listeners for ICE state
    setupQRConnectionListeners(pc, {
      onConnected: () => {
        logQR('✅ ICE Connection: connected');
      },
      onDisconnected: () => {
        logQR('❌ ICE Connection: disconnected');
        qrConnectionStatus.value = {
          type: 'error',
          icon: 'mdi:close-circle',
          message: 'Verbindung getrennt'
        };
        qrPeerConnection.value = null;
        qrDataChannel.value = null;
        qrConnectedPeer.value = null;
      },
      onDataChannel: (channel) => {
        // This shouldn't be called anymore since we handle it above
        logQR('⚠️ onDataChannel callback called (should not happen)');
      },
      onError: (error) => {
        qrConnectionStatus.value = {
          type: 'info',
          icon: 'mdi:loading',
          message: error.message
        };
      },
      onFailed: () => {
        qrConnectionStatus.value = {
          type: 'error',
          icon: 'mdi:alert-circle',
          message: 'Verbindung fehlgeschlagen. Bitte erneut versuchen.'
        };
      }
    });

    // Connect to QR signaling server and send answer
    qrConnectionStatus.value = {
      type: 'info',
      icon: 'mdi:loading',
      message: 'Sende Antwort an Sender...'
    };

    logSignaling(`📤 Sending answer to ${peerAlias} via dedicated QR signaling`);
    logSignaling(`Target sender ID: ${senderId}`);

    // Send answer via dedicated QR signaling (Render.com server)
    try {
      // Setup QR signaling connection to Render.com server
      logQR(`Setting up dedicated QR signaling connection...`);
      const qrSignaling = await setupQRSignaling();
      logQR(`✅ QR signaling connected for answer transmission`);

      if (qrSignaling && senderId) {
        logSignaling(`Sending QR_ANSWER to ${senderId} via Render.com server`);
        qrSignaling.send({
          type: 'QR_ANSWER',
          targetId: senderId,
          answer: answer
        } as any);

        logSignaling('✅ QR_ANSWER sent to sender via Render.com signaling');
        logQR('✅ RECEIVER: Answer transmission complete');

        qrConnectionStatus.value = {
          type: 'success',
          icon: 'mdi:check-circle',
          message: 'Verbindung wird aufgebaut...'
        };

        // Setup callback for incoming ICE candidates (Trickle ICE) - RECEIVER side
        store._onIceCandidate = async (candidate: RTCIceCandidateInit) => {
          try {
            logWebRTC('📨 RECEIVER: Received ICE candidate via Trickle ICE');
            if (qrPeerConnection.value) {
              await addIceCandidate(qrPeerConnection.value, candidate);
              logWebRTC('✅ RECEIVER: ICE candidate added to PeerConnection');
            } else {
              logWebRTC('⚠️ RECEIVER: No PeerConnection available to add ICE candidate');
            }
          } catch (err) {
            logError(err as Error, 'Error adding ICE candidate (RECEIVER)');
          }
        };
        logQR('👂 Listening for ICE_CANDIDATE via Trickle ICE (RECEIVER)...');

        // NOW wait for datachannel to be received (after answer was sent!)
        logQR('⏳ Waiting for DataChannel from sender...');
        const dataChannel = await dataChannelPromise;
        logQR('✅ DataChannel received!');
        logQR(`   - label: ${dataChannel.label}`);
        logQR(`   - readyState: ${dataChannel.readyState}`);

        // Store datachannel
        qrDataChannel.value = dataChannel;

        // Keep-alive interval for receiver
        let keepAliveInterval: NodeJS.Timeout | null = null;

        // Setup datachannel event listeners
        dataChannel.addEventListener('open', () => {
          logQR('✅ RECEIVER: DataChannel OPEN!');
          qrConnectionStatus.value = {
            type: 'success',
            icon: 'mdi:check-circle',
            message: 'Verbunden! Bereit für Dateitransfer'
          };

          // Scroll to top to show "Dateien senden" button
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Setup file receiver
          setupQRFileReceiver(dataChannel);

          // Start keep-alive pings every 2 seconds (increased frequency for stability)
          keepAliveInterval = setInterval(() => {
            if (dataChannel.readyState === 'open') {
              try {
                dataChannel.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
              } catch (e) {
                console.warn('Keep-alive ping failed:', e);
              }
            } else {
              if (keepAliveInterval) clearInterval(keepAliveInterval);
            }
          }, 2000);
        });

        dataChannel.addEventListener('close', () => {
          logQR('❌ RECEIVER: DataChannel CLOSED');
          qrConnectionStatus.value = {
            type: 'error',
            icon: 'mdi:close-circle',
            message: 'Verbindung getrennt'
          };
          qrPeerConnection.value = null;

          // Clear keep-alive
          if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
            keepAliveInterval = null;
          }
          qrDataChannel.value = null;
          qrConnectedPeer.value = null;
        });

        dataChannel.addEventListener('error', (error) => {
          logError(`DataChannel error: ${error}`, 'QR');
          qrConnectionStatus.value = {
            type: 'error',
            icon: 'mdi:alert-circle',
            message: `Fehler: Datenkanal-Fehler`
          };
        });
      } else {
        logError('No QR signaling connection available!', 'RECEIVER');
        qrConnectionStatus.value = {
          type: 'error',
          icon: 'mdi:alert-circle',
          message: 'Keine QR-Signaling-Verbindung'
        };
      }
    } catch (err) {
      logError(err as Error, 'Failed to send answer');
      qrConnectionStatus.value = {
        type: 'error',
        icon: 'mdi:alert-circle',
        message: 'Fehler beim Senden der Antwort'
      };
    }

  } catch (error) {
    console.error('QR scan processing error:', error);
    qrConnectionStatus.value = {
      type: 'error',
      icon: 'mdi:alert-circle',
      message: `Fehler: ${error instanceof Error ? error.message : 'Ungültiger QR-Code'}`
    };
  }
};

onMounted(async () => {
  // Log app version from package.json
  const { version } = await import('~/package.json');
  appVersion.value = version; // Set version for UI display

  // Set frontend start time
  const now = new Date();
  frontendStartTime.value = now.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  console.log(`%c🚀 ClevrSend v${version} %c- powered by MyTech`,
    'color: #00ff88; font-weight: bold; font-size: 16px;',
    'color: #888; font-size: 12px;'
  );
  logApp(`App started - Version ${version}`);
  logApp(`Frontend ready at: ${frontendStartTime.value}`);
  logApp(`User Agent: ${navigator.userAgent}`);
  logApp(`Screen: ${window.screen.width}x${window.screen.height}`);

  webCryptoSupported.value = isWebCryptoSupported();
  logApp(`WebCrypto supported: ${webCryptoSupported.value}`);

  // Fetch backend version from signaling server
  try {
    const response = await fetch('https://clevrsend-signaling.onrender.com/health');
    const data = await response.json();
    if (data.version) {
      backendVersion.value = data.version;
      logApp(`Backend Version: ${data.version}`);

      // Calculate backend uptime (uptime is in milliseconds from performance.now())
      if (data.uptime) {
        const uptimeMs = data.uptime;
        const backendStartTime = new Date(Date.now() - uptimeMs);
        backendUptime.value = backendStartTime.toLocaleString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        logApp(`Backend ready at: ${backendUptime.value}`);
      }

      // Check for version mismatch
      if (version !== data.version) {
        versionMismatch.value = true;
        logError(`Version-Konflikt: Frontend v${version} ≠ Backend v${data.version}`, 'VERSION_CHECK');
        console.warn(`⚠️ Version-Konflikt erkannt!`);
        console.warn(`   Frontend: v${version}`);
        console.warn(`   Backend:  v${data.version}`);
      } else {
        logApp(`✅ Version-Check erfolgreich: v${version}`);
      }
    }
  } catch (error) {
    console.warn('Could not fetch backend version:', error);
  }

  // Check for QR-Connect URL parameter
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const qrParam = urlParams.get('qr');

    if (qrParam) {
      // Switch to QR mode
      activeMode.value = 'qr';

      // Auto-process the QR connection after setup is complete
      setTimeout(async () => {
        try {
          // Reconstruct the full URL
          const fullUrl = `${window.location.origin}/?qr=${qrParam}`;
          await handleQrScanned(fullUrl);

          // Clean URL (remove parameter)
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Auto QR-Connect failed:', error);
        }
      }, 2000); // Wait for connection setup
    }
  }

  setTimeout(() => {
    // to prevent flickering during initial connection
    // i.e. show blank screen instead of "Connecting..."
    minDelayFinished.value = true;
  }, 1000);

  if (!webCryptoSupported.value) {
    console.error("Web Crypto API is not supported in this browser.");
    return;
  }

  await upgradeToEd25519IfSupported();

  store.key = await generateKeyPair();

  console.log(await cryptoKeyToPem(store.key.publicKey));

  const userAgent = navigator.userAgent;
  const token = await generateClientTokenFromCurrentTimestamp(store.key);

  const info = {
    alias: generateRandomAlias(),
    version: protocolVersion,
    deviceModel: getAgentInfoString(userAgent),
    deviceType: PeerDeviceType.web,
    token: token,
  };

  await setupConnection({
    info,
    onPin: async () => {
      return await showCustomPinDialog(t("index.enterPin"));
    },
  });
});
</script>

<style scoped>
/* AirDrop Tagline */
.airdrop-tagline {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15));
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  white-space: nowrap;
  animation: fadeInSlide 1s ease-out 0.5s both;
  position: relative;
  overflow: hidden;
}

.airdrop-tagline::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  animation: shimmer 3s infinite;
}

@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* Mobile: Hide desktop tagline */
@media (max-width: 768px) {
  .airdrop-tagline {
    display: none;
  }
}

/* Mobile Tagline under Mode Tabs */
.airdrop-tagline-mobile {
  display: none;
}

@media (max-width: 768px) {
  .airdrop-tagline-mobile {
    display: block;
    margin-top: 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(139, 92, 246, 0.25);
    backdrop-filter: blur(10px);
    text-align: center;
    animation: fadeInSlide 1s ease-out 0.8s both;
  }
}

.peer-card-content {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  transition: transform 0.2s;
  position: relative;
  overflow: hidden;
  padding-top: 3rem; /* Space for badge on top */
}

/* Mobile: Less top padding */
@media (max-width: 480px) {
  .peer-card-content {
    padding-top: 2.5rem;
  }
}

.peer-card-content:hover {
  transform: translateY(-4px);
}

/* Spotlight effect */
.peer-card-with-spotlight {
  position: relative;
  overflow: hidden;
}

.peer-spotlight-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.peer-card-with-spotlight:hover .peer-spotlight-overlay {
  opacity: 1;
}

.peer-card-with-spotlight > * {
  position: relative;
  z-index: 2;
}

.peer-icon {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.peer-label {
  font-size: 0.65rem;
  color: rgba(156, 163, 175, 0.8);
  font-weight: 400;
  margin-bottom: 0.25rem;
}

.peer-name {
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
}

.peer-details {
  margin-top: 0.25rem;
}

.peer-timestamp {
  font-size: 0.75rem;
  color: rgba(139, 92, 246, 0.7);
  margin-top: 0.5rem;
  font-style: italic;
}

.peer-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex: 1;
  width: 100%;
}

.upload-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.2);
  border: 2px dashed rgba(139, 92, 246, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(139, 92, 246, 0.9);
}

.upload-button:hover {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.8);
  transform: scale(1.05);
}

.upload-text {
  font-size: 0.875rem;
  color: rgba(156, 163, 175, 0.8);
  text-align: center;
}

.logo-white {
  object-fit: contain;
  animation: logoBlurIn 1.2s ease-out forwards;
  opacity: 0;
}

@keyframes logoBlurIn {
  0% {
    filter: blur(10px);
    opacity: 0;
    transform: translateY(-30px) scale(0.8);
  }
  60% {
    filter: blur(3px);
    opacity: 0.7;
  }
  100% {
    filter: blur(0px);
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Own Card - Orange */
.own-card {
  background: transparent !important;
  border-color: rgba(249, 115, 22, 0.4) !important;
  cursor: default !important;
  padding-top: 3rem; /* Space for badge on top */
}

.own-card:hover {
  background: transparent !important;
  border-color: rgba(249, 115, 22, 0.5) !important;
  transform: translateY(0) !important;
}

/* Mobile: Less top padding */
@media (max-width: 480px) {
  .own-card {
    padding-top: 2.5rem;
  }
}

.own-card .peer-name {
  color: rgb(249, 115, 22);
}

/* Own Card User Info */
.own-card-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 0.75rem;
  width: 100%;
}

.own-card-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.own-card-label {
  font-size: 0.65rem;
  color: rgba(156, 163, 175, 0.8);
  font-weight: 400;
}

.own-card-value {
  font-weight: 700;
  font-size: 1.125rem;
  color: rgb(249, 115, 22);
  transition: all 0.2s;
}

.own-card-value:hover {
  color: rgb(251, 146, 60);
  transform: scale(1.05);
}

.own-card-divider {
  width: 2px;
  height: 2.5rem;
  background: rgba(249, 115, 22, 0.3);
}

.own-card-pin-button {
  background: rgba(249, 115, 22, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.4);
  border-radius: 0.75rem;
  padding: 0.75rem;
  color: rgb(249, 115, 22);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.own-card-pin-button:hover {
  background: rgba(249, 115, 22, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
}

.own-card-device {
  text-align: center;
  color: rgba(249, 115, 22, 0.8);
}

/* Powered By */
.powered-by {
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-top: -0.5rem;
  margin-left: 0;
  white-space: nowrap;
}

/* Mobile: Smaller powered-by text */
@media (max-width: 640px) {
  .powered-by {
    font-size: 0.75rem; /* Smaller on mobile */
  }
}

@media (max-width: 380px) {
  .powered-by {
    font-size: 0.625rem; /* Even smaller on very small screens */
  }
}

/* Newest Label */
.newest-label {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.25);
}

/* Card Type Badge */
.card-type-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  z-index: 5;
  opacity: 0.9;
  pointer-events: none;
}

/* Mobile: Smaller badges to prevent overflow */
@media (max-width: 480px) {
  .card-type-badge {
    font-size: 0.65rem;
    padding: 0.35rem 0.5rem;
    gap: 0.25rem;
    top: 0.75rem;
    right: 0.75rem;
  }
}

.own-card-badge {
  background: rgba(249, 115, 22, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.4);
  color: rgb(249, 115, 22);
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.3);
}

.peer-card-badge {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: rgb(139, 92, 246);
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}

/* Version Info */
.version-info {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

/* Mobile: Hide version info (too much clutter) */
@media (max-width: 768px) {
  .version-info {
    display: none;
  }
}

.version-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 500;
}

.version-label {
  opacity: 0.6;
}

.version-value {
  font-weight: 600;
}

.status-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-indicator-small {
  margin-top: 0.15rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-indicator-small.success {
  color: rgb(74, 222, 128);
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.status-time {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
}

.version-mismatch-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #ff9800;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.3);
  border-radius: 0.5rem;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Settings Button */
.settings-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* Share Button */
.share-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* PIN Button */
.pin-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pin-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* Settings Panel */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* User Info Section */
.user-info-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.75rem;
}

.user-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-info-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.user-info-value {
  font-weight: 600;
  color: white;
  transition: color 0.2s;
}

.user-info-value:hover {
  color: rgb(139, 92, 246);
}

.user-info-divider {
  width: 2px;
  height: 2.5rem;
  background: rgba(139, 92, 246, 0.3);
}

.pin-button-inline {
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
  margin-left: auto;
}

.pin-button-inline:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.settings-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.settings-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0;
}

.close-button {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
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
  background: rgba(139, 92, 246, 0.3);
  transform: scale(1.05);
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgb(255, 255, 255);
  cursor: pointer;
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgb(255, 255, 255);
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.reset-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-top: 1rem;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Blur Text Title */
.blur-text-title {
  display: block;
  white-space: nowrap;
}

/* Mobile: Smaller logo text */
@media (max-width: 640px) {
  .blur-text-title {
    font-size: 1.875rem !important; /* text-3xl instead of text-4xl */
  }
}

@media (max-width: 380px) {
  .blur-text-title {
    font-size: 1.5rem !important; /* text-2xl for very small screens */
  }
}

/* Drag and Drop */
.peer-card-content {
  position: relative;
}

.peer-card-content.drag-over {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.6);
}

.drop-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 1.5rem;
  color: white;
  opacity: 0.5;
  z-index: 10;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Share Dialog */
.share-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.share-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-url-section {
  display: flex;
  gap: 0.5rem;
}

.share-url-input {
  flex: 1;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.share-url-input:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
}

.copy-button {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: scale(1.05);
}

.share-channels {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.share-channels-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.share-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.share-channel-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
}

.share-channel-button.whatsapp {
  background: rgba(37, 211, 102, 0.1);
  border-color: rgba(37, 211, 102, 0.3);
  color: rgb(37, 211, 102);
}

.share-channel-button.whatsapp:hover {
  background: rgba(37, 211, 102, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.share-channel-button.telegram {
  background: rgba(0, 136, 204, 0.1);
  border-color: rgba(0, 136, 204, 0.3);
  color: rgb(0, 136, 204);
}

.share-channel-button.telegram:hover {
  background: rgba(0, 136, 204, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3);
}

.share-channel-button.email {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
  color: rgb(139, 92, 246);
}

.share-channel-button.email:hover {
  background: rgba(139, 92, 246, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.share-channel-button.twitter {
  background: rgba(29, 161, 242, 0.1);
  border-color: rgba(29, 161, 242, 0.3);
  color: rgb(29, 161, 242);
}

.share-channel-button.twitter:hover {
  background: rgba(29, 161, 242, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3);
}

.share-channel-button.facebook {
  background: rgba(66, 103, 178, 0.1);
  border-color: rgba(66, 103, 178, 0.3);
  color: rgb(66, 103, 178);
}

.share-channel-button.facebook:hover {
  background: rgba(66, 103, 178, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 103, 178, 0.3);
}

.share-channel-button.qr {
  background: rgba(249, 115, 22, 0.1);
  border-color: rgba(249, 115, 22, 0.3);
  color: rgb(249, 115, 22);
}

.share-channel-button.qr:hover {
  background: rgba(249, 115, 22, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.qr-code-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.75rem;
}

.qr-code-canvas {
  border-radius: 0.5rem;
  background: white;
  padding: 0.5rem;
}

.qr-code-hint {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
}

/* QR Code Modal */
.qr-code-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

.qr-code-modal {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(249, 115, 22, 0.4);
  border-radius: 1.5rem;
  padding: 2.5rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 0 60px rgba(249, 115, 22, 0.3);
  opacity: 0;
  animation: scaleIn 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.qr-code-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.qr-code-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.qr-code-display {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code-canvas-large {
  display: block;
  border-radius: 0.5rem;
  margin: 0 auto;
}

.qr-code-modal-hint {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
}

.qr-code-url-display {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.qr-url-input {
  flex: 1;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  text-align: center;
}

.copy-button-small {
  background: rgba(249, 115, 22, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button-small:hover {
  background: rgba(249, 115, 22, 0.3);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
}

/* Custom PIN Dialog */
.pin-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pin-dialog {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pin-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.pin-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pin-dialog-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.pin-dialog-input:focus {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.pin-dialog-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.pin-dialog-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.pin-dialog-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pin-dialog-button-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.pin-dialog-button-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.pin-dialog-button-submit {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.pin-dialog-button-submit:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

/* Mode Tabs */
.mode-tabs-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.mode-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.5rem;
}

.mode-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  font-weight: 500;
  font-size: 0.9rem;
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
}

.mode-tab-active {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* QR-Connect Styles */
.qr-connect-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.qr-connect-header {
  text-align: center;
  margin-bottom: 1rem;
}

.qr-connect-description {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
  font-size: 1rem;
}

.qr-connection-status {
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 0.75rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
}

.status-indicator.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: rgb(74, 222, 128);
}

.status-indicator.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgb(248, 113, 113);
}

.status-indicator.info {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: rgb(96, 165, 250);
}

.qr-file-upload-section {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.qr-file-upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 4rem;
  border-radius: 1rem;
  border: 3px solid rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(74, 222, 128);
}

.qr-file-upload-button:hover {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
}

.qr-file-upload-hint {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  text-align: center;
}

.qr-connect-section {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}

.qr-section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.qr-section-hint {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.qr-action-button-container {
  display: flex;
  justify-content: center;
}

.qr-action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 3rem;
  border-radius: 1rem;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.125rem;
  font-weight: 500;
}

.qr-button-primary {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.qr-button-primary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.02);
}

.qr-button-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.qr-button-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.02);
}

.qr-code-display-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  width: 100%;
}

.qr-code-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
}

.qr-code-box {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: qr-fade-in 0.3s ease-out;
}

@keyframes qr-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.qr-canvas {
  display: block;
  max-width: 100%;
  height: auto;
}

.qr-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.qr-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qr-action-btn.qr-copy {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.qr-action-btn.qr-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.qr-action-btn.qr-close {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.qr-action-btn.qr-close:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.qr-link-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.qr-link-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  overflow: hidden;
}

.qr-link-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qr-copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 0.5rem;
  color: rgb(96, 165, 250);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.qr-copy-button:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: scale(1.02);
}

.qr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.qr-loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(59, 130, 246, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.qr-loading-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.qr-wait-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.qr-next-step {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgba(59, 130, 246, 0.3);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qr-next-step-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(96, 165, 250);
  font-weight: 600;
  font-size: 1.125rem;
  text-align: center;
}

.qr-close-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.qr-close-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.qr-connect-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

.qr-connect-info {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  color: rgb(147, 197, 253);
}

.qr-info-text {
  flex: 1;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .settings-panel {
    width: 100%;
  }

  .share-dialog {
    width: 95%;
  }

  .share-buttons-grid {
    grid-template-columns: 1fr;
  }

  .qr-code-modal {
    width: 95%;
    padding: 1.5rem;
  }

  .qr-code-display {
    padding: 1rem;
  }
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  min-width: 250px;
  max-width: 400px;
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .toast-container {
    right: 0.5rem;
    left: 0.5rem;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}

/* Waiting Card (Empty State) */
.waiting-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(59, 130, 246, 0.05);
  border: 2px dashed rgba(59, 130, 246, 0.3);
  cursor: default;
  height: 100%;
  min-height: 280px; /* Same height as own card */
}

.waiting-card:hover {
  transform: none;
  background: rgba(59, 130, 246, 0.05);
}

.waiting-card-icon {
  color: rgba(59, 130, 246, 0.6);
}

.radar-icon {
  animation: radar-pulse 2s ease-in-out infinite;
}

@keyframes radar-pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(180deg);
  }
}

.waiting-card-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.waiting-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.waiting-card-hint {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.waiting-card-dots {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.waiting-card-dots .dot {
  width: 8px;
  height: 8px;
  background: rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.waiting-card-dots .dot:nth-child(1) {
  animation-delay: 0s;
}

.waiting-card-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.waiting-card-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Retry Status Bar */
.retry-status-bar {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.15);
  border-left: 4px solid #3b82f6;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s ease;
}

.retry-status-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgb(147, 197, 253);
  font-weight: 500;
  font-size: 0.95rem;
}

.retry-icon-spin {
  animation: spin 1.5s linear infinite;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Legal Footer */
.legal-footer {
  margin-top: auto;
  padding: 2rem 1rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2));
  opacity: 0.5;
}

.legal-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.legal-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.legal-separator {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
}

.legal-copyright {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  font-weight: 400;
}

/* Mobile: Stack legal links vertically */
@media (max-width: 480px) {
  .legal-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .legal-separator {
    display: none;
  }
}
</style>
