<template>
  <div class="magic-bento-grid">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'bento-card',
        item.size,
        { 'has-glow': item.glow },
        { 'orange-card': item.isOwnCard },
        { 'newest-card': item.isNewest }
      ]"
      @mouseenter="handleMouseEnter(index)"
      @mouseleave="handleMouseLeave(index)"
      :style="getCardStyle(index)"
    >
      <div class="bento-card-content">
        <div class="bento-header">
          <h3 class="bento-title">
            <span v-if="item.titleLabel" class="title-label">{{ item.titleLabel }}</span>
            <span class="title-value">{{ item.title }}</span>
          </h3>
          <transition name="fade">
            <div v-if="item.isNewest && item.showNewestLabel" class="newest-badge">
              Neuster Empfänger
            </div>
          </transition>
        </div>
        <p v-if="item.description" class="bento-description">{{ item.description }}</p>
        <p v-if="item.timestamp" class="peer-timestamp">Online seit: {{ item.timestamp }}</p>
        <slot :name="`card-${index}`" :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface BentoItem {
  title: string;
  titleLabel?: string;
  description?: string;
  timestamp?: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  glow?: boolean;
  particles?: boolean;
  isOwnCard?: boolean;
  isNewest?: boolean;
  showNewestLabel?: boolean;
  customBorderColor?: string;
  customGlowColor?: string;
  customGradient1?: string;
  customGradient2?: string;
}

interface Props {
  items: BentoItem[];
}

const props = defineProps<Props>();

const hoveredIndex = ref<number | null>(null);

const handleMouseEnter = (index: number) => {
  hoveredIndex.value = index;
};

const handleMouseLeave = (index: number) => {
  if (hoveredIndex.value === index) {
    hoveredIndex.value = null;
  }
};

const getCardStyle = (index: number) => {
  const isHovered = hoveredIndex.value === index;
  const item = props.items[index];

  const style: Record<string, string | number> = {
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    zIndex: isHovered ? 10 : 1,
  };

  // Apply custom colors for peer cards (not own card)
  if (!item.isOwnCard && item.customBorderColor) {
    style['--custom-border-color'] = item.customBorderColor;
    style['--custom-glow-color'] = item.customGlowColor || item.customBorderColor;
    style['--custom-gradient-1'] = item.customGradient1 || item.customBorderColor;
    style['--custom-gradient-2'] = item.customGradient2 || item.customBorderColor;
  }

  return style;
};

const getParticleStyle = (i: number) => {
  const angle = (i / 5) * Math.PI * 2;
  const distance = 20 + Math.random() * 10;
  return {
    left: `${50 + Math.cos(angle) * distance}%`,
    top: `${50 + Math.sin(angle) * distance}%`,
    animationDelay: `${i * 0.2}s`,
  };
};
</script>

<style scoped>
.magic-bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  .magic-bento-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.bento-card {
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--custom-border-color, rgba(139, 92, 246, 0.2));
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 200px;
}

.bento-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  padding: 1px;
  background: linear-gradient(135deg, var(--custom-gradient-1, rgba(139, 92, 246, 0.3)), transparent, var(--custom-gradient-2, rgba(99, 102, 241, 0.3)));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.bento-card:hover::before {
  opacity: 1;
}

.bento-card.has-glow {
  border-color: var(--custom-border-color, rgba(139, 92, 246, 0.5));
  box-shadow: 0 0 30px var(--custom-glow-color, rgba(139, 92, 246, 0.3));
}

/* Orange Card for Own Device */
.bento-card.orange-card {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(249, 115, 22, 0.5);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.3);
}

.bento-card.orange-card::before {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.3), transparent, rgba(251, 146, 60, 0.3));
}

.bento-card.orange-card .particle {
  background: rgba(249, 115, 22, 0.8);
}

.bento-card.small {
  grid-column: span 1;
  grid-row: span 1;
}

.bento-card.medium {
  grid-column: span 2;
  grid-row: span 1;
}

.bento-card.large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-card.wide {
  grid-column: span 2;
  grid-row: span 1;
}

.bento-card.tall {
  grid-column: span 1;
  grid-row: span 2;
}

.bento-card-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bento-header {
  position: relative;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.bento-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
}

.bento-title .title-label {
  font-size: 0.9rem;
  color: rgba(200, 200, 200, 0.9);
  font-weight: 400;
}

.bento-title .title-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.newest-badge {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  position: relative;
  color: rgba(255, 255, 255, 0.7);
}

.newest-badge::before {
  content: 'Neuster Empfänger';
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 60%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 5s linear infinite;
}

.bento-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.5;
}

.peer-timestamp {
  font-size: 0.75rem;
  color: rgba(139, 92, 246, 0.7);
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-style: italic;
}

.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.bento-card-content {
  position: relative;
  z-index: 2;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(139, 92, 246, 0.8);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
  transform-origin: center;
  will-change: transform, opacity;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) scale(1.5);
    opacity: 1;
  }
}

/* Newest Card Animation */
.bento-card.newest-card {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.25);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2);
  }
}

/* Shine Animation for Newest Badge */
@keyframes shine {
  0% {
    background-position: 100%, 0%;
  }
  100% {
    background-position: -100%, 0%;
  }
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

/* Responsive adjustments */
@media (max-width: 767px) {
  .bento-card {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
}
</style>
