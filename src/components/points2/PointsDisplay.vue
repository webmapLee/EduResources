<template>
  <div class="points-display" :class="{ 'points-animate': isAnimating }">
    <div class="points-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 md:w-6 md:h-6">
        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="points-value">{{ pointsStore.totalPoints }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePointsStore } from '../../store/points';

const pointsStore = usePointsStore();
const isAnimating = ref(false);

// 监听积分变化，触发动画
watch(() => pointsStore.totalPoints, (newValue, oldValue) => {
  if (newValue > oldValue) {
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 1000);
  }
});
</script>

<style scoped>
.points-display {
  position: absolute;
  top: 100%;
  right: 20px;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  transition: transform 0.3s ease;
  font-size: 14px;
}

@media (min-width: 768px) {
  .points-display {
    padding: 8px 16px;
    gap: 8px;
    font-size: 16px;
  }
}

.points-icon {
  color: #f59e0b;
}

.points-value {
  font-weight: bold;
  color: #1f2937;
}

.points-animate {
  transform: translateY(-50%) scale(1.2);
  animation: pulse 1s ease;
}

@keyframes pulse {
  0% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.2); }
  100% { transform: translateY(-50%) scale(1); }
}
</style>