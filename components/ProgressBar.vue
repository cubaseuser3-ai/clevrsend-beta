<template>
  <div class="progress-bar-container w-full h-2 mt-1">
    <div
      class="progress-bar-fill h-full"
      :style="{ width: `${props.progress * 100}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  progress: number;
}>();
</script>

<style scoped>
.progress-bar-container {
  background: rgba(139, 92, 246, 0.2);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  background: linear-gradient(90deg, rgb(139, 92, 246), rgb(167, 139, 250));
  border-radius: 9999px;
  transition: width 0.3s ease;
}
</style>
