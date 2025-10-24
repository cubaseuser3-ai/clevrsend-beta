<template>
  <transition name="slide-down">
    <div
      v-if="props.visible"
      class="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 pointer-events-none"
    >
      <div
        class="dialog-container w-full max-w-2xl mx-4 pointer-events-auto"
        role="dialog"
        aria-modal="true"
      >
        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
}>();
</script>

<style scoped>
.dialog-container {
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 1.25rem;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(139, 92, 246, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  color: white;
  padding: 1.5rem;
}

/* Slide down animation from top */
.slide-down-enter-active {
  animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-leave-active {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-30px) scale(0.98);
  }
}
</style>
