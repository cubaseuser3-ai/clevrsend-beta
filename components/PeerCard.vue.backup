<template>
  <div
    ref="cardRef"
    @mousemove="handleMouseMove"
    class="peer-card-spotlight flex py-2 text-white drop-shadow-lg rounded-lg bg-teal-700 hover:bg-teal-600 cursor-pointer"
  >
    <div class="flex items-center justify-center px-2">
      <Icon :name="iconName" class="size-10" />
    </div>
    <div class="flex-1">
      <p class="text-xl">{{ props.peer.alias }}</p>
      <p class="text-xs mt-1 mb-1">
        <span class="bg-teal-900 px-1 py-0.5 rounded">{{
          props.peer.deviceModel ?? "Unknown"
        }}</span>
        <span class="ml-2 bg-teal-900 px-1 py-0.5 rounded">WebRTC</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type ClientInfo } from "@/services/signaling";

const props = defineProps<{
  peer: ClientInfo;
}>();

const cardRef = ref<HTMLElement | null>(null);

const iconName = computed(() => {
  switch (props.peer.deviceType) {
    case "mobile":
      return "material-symbols:smartphone";
    case "desktop":
      return "material-symbols:computer";
    case "web":
      return "material-symbols:language";
    case "headless":
      return "material-symbols:terminal";
    case "server":
      return "material-symbols:dns";
    default:
      return "material-symbols:help";
  }
});

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  cardRef.value.style.setProperty('--mouse-x', `${x}px`);
  cardRef.value.style.setProperty('--mouse-y', `${y}px`);
};
</script>

<style scoped>
.peer-card-spotlight {
  position: relative;
  overflow: hidden;
  --mouse-x: 50%;
  --mouse-y: 50%;
}

.peer-card-spotlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle 120px at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.15),
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.peer-card-spotlight:hover::before {
  opacity: 1;
}

.peer-card-spotlight > * {
  position: relative;
  z-index: 2;
}
</style>
