<template>
  <div ref="container" :class="className" class="blur-text-container">
    <span
      v-for="(segment, index) in segments"
      :key="index"
      :class="['blur-text-segment', { 'in-view': inView }]"
      :style="getSegmentStyle(index)"
    >
      {{ segment === ' ' ? '\u00A0' : segment }}{{ animateBy === 'words' && index < segments.length - 1 ? '\u00A0' : '' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'characters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  stepDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  delay: 150,
  className: '',
  animateBy: 'words',
  direction: 'top',
  threshold: 0.1,
  stepDuration: 0.7
});

const emit = defineEmits<{
  animationComplete: [];
}>();

const container = ref<HTMLElement | null>(null);
const inView = ref(false);
let observer: IntersectionObserver | null = null;

const segments = computed(() => {
  return props.animateBy === 'words'
    ? props.text.split(' ')
    : props.text.split('');
});

const getSegmentStyle = (index: number) => {
  return {
    animationDelay: `${(index * props.delay) / 1000}s`,
    animationDuration: `${props.stepDuration}s`,
  };
};

onMounted(() => {
  if (!container.value) return;

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true;
        if (observer && container.value) {
          observer.unobserve(container.value);
        }

        // Emit completion event after all animations finish
        const totalTime = ((segments.value.length - 1) * props.delay) + (props.stepDuration * 1000);
        setTimeout(() => {
          emit('animationComplete');
        }, totalTime);
      }
    },
    { threshold: props.threshold }
  );

  observer.observe(container.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.blur-text-container {
  display: flex;
  flex-wrap: wrap;
}

.blur-text-segment {
  display: inline-block;
  will-change: transform, filter, opacity;
  filter: blur(10px);
  opacity: 0;
  transform: translateY(-50px);
}

.blur-text-segment.in-view {
  animation: blurIn forwards;
}

@keyframes blurIn {
  0% {
    filter: blur(10px);
    opacity: 0;
    transform: translateY(-50px);
  }
  50% {
    filter: blur(5px);
    opacity: 0.5;
    transform: translateY(5px);
  }
  100% {
    filter: blur(0px);
    opacity: 1;
    transform: translateY(0);
  }
}

/* Bottom direction variant */
.blur-text-segment[data-direction="bottom"] {
  transform: translateY(50px);
}

.blur-text-segment[data-direction="bottom"].in-view {
  animation: blurInBottom forwards;
}

@keyframes blurInBottom {
  0% {
    filter: blur(10px);
    opacity: 0;
    transform: translateY(50px);
  }
  50% {
    filter: blur(5px);
    opacity: 0.5;
    transform: translateY(-5px);
  }
  100% {
    filter: blur(0px);
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
