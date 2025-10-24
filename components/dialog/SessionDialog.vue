<template>
  <Dialog :visible="store.session.state !== SessionState.idle">
    <div class="transfer-content">
      <!-- Header with icon and title -->
      <div class="transfer-header">
        <div class="transfer-icon">
          <Icon
            :name="store.session.state === SessionState.sending ? 'mdi:upload' : 'mdi:download'"
            size="24"
          />
        </div>
        <h1 class="transfer-title">
          {{
            store.session.state === SessionState.sending
              ? t("index.progress.titleSending")
              : t("index.progress.titleReceiving")
          }}
        </h1>
      </div>

      <!-- Total progress - compact -->
      <div class="total-progress">
        <div class="total-info">
          <span class="total-label">Total:</span>
          <span class="total-size">{{ totalCurr }} / {{ totalTotal }}</span>
        </div>
        <ProgressBar :progress="store.session.curr / store.session.total" />
      </div>

      <!-- Files header -->
      <div class="files-header">
        <Icon name="mdi:file-multiple" size="16" />
        <span>Files:</span>
      </div>

      <!-- Files list - scrollable -->
      <div class="files-list">
        <FileProgress
          v-for="file in store.session.fileState"
          :key="file.id"
          :state="file"
          class="file-item"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { SessionState, store } from "~/services/store";
import { formatBytes } from "~/utils/fileSize";

const { t } = useI18n();

const totalCurr = computed(() => {
  return formatBytes(store.session.curr);
});

const totalTotal = computed(() => {
  return formatBytes(store.session.total);
});
</script>

<style scoped>
.transfer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transfer-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.transfer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: rgb(167, 139, 250);
}

.transfer-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.total-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(139, 92, 246, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.75rem;
}

.total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.total-size {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
}

.files-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  padding-left: 0.25rem;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom scrollbar */
.files-list::-webkit-scrollbar {
  width: 6px;
}

.files-list::-webkit-scrollbar-track {
  background: rgba(139, 92, 246, 0.05);
  border-radius: 3px;
}

.files-list::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
}

.files-list::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}

.file-item {
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.file-item:hover {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(139, 92, 246, 0.2);
}
</style>
