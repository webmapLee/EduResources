<template>
  <div class="app-container bg-secondary-50">
    <div class="header-container relative">
      <header-component />
    </div>
    
    <!-- 页面过渡效果 -->
    <div class="router-view-container">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    
    <!-- 装饰性动画元素 -->
    <div class="fixed bottom-10 right-10 z-10 hidden md:block">
      <div ref="floatingElement" class="animate-float">
        <lottie-animation 
          :animation-data="educationAnimationData" 
          :width="120" 
          :height="120" 
          :loop="true" 
          :autoplay="true" 
        />
      </div>
    </div>
    
    <footer-component />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import HeaderComponent from './components/layout/HeaderComponent.vue';
import FooterComponent from './components/layout/FooterComponent.vue';
import { usePointsStore } from './store/points';
import LottieAnimation from './components/LottieAnimation.vue';
import educationAnimationData from './assets/animations/education-animation.json';

const pointsStore = usePointsStore();
const floatingElement = ref(null);

onMounted(() => {
  // 初始化积分系统
  pointsStore.initPoints();
  
  // 记录每日访问积分
  pointsStore.recordDailyVisit();
  
  // 设置停留时间积分计时器
  const stayTimeInterval = setInterval(() => {
    pointsStore.recordStayTime();
  }, 5 * 60 * 1000); // 每5分钟
  
  // 组件卸载时清除计时器
  return () => {
    clearInterval(stayTimeInterval);
  };
});
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.header-container {
  position: relative;
}

/* 页面过渡效果 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
  position: relative;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 确保路由视图内容可滚动 */
.router-view-container {
  flex: 1;
}
</style>