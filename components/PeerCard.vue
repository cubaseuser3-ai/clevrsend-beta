<template>
  <div
    class="peer-card-with-spotlight flex py-2 text-white drop-shadow-lg rounded-lg bg-teal-700 hover:bg-teal-600 cursor-pointer relative overflow-hidden"
    @mousemove="handleMouseMove"
    ref="cardRef"
  >
    <!-- Spotlight effect overlay -->
    <div
      class="spotlight-overlay absolute inset-0 pointer-events-none opacity-0"
      :style="spotlightStyle"
    ></div>

    <div class="flex items-center justify-center px-2 relative z-10">
      <Icon :name="iconName" class="size-10" />
    </div>
    <div class="flex-1 relative z-10">
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
import { ref, computed } from 'vue';
import { type ClientInfo } from "@/services/signaling";

const props = defineProps<{
  peer: ClientInfo;
}>();

const cardRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);

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

const spotlightStyle = computed(() => ({
  background: `radial-gradient(circle 120px at ${mouseX.value}px ${mouseY.value}px, rgba(255, 255, 255, 0.15), transparent 80%)`
}));

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
};
</script>

<style scoped>
.peer-card-with-spotlight:hover .spotlight-overlay {
  opacity: 1;
  transition: opacity 0.3s ease;
}
</style>
