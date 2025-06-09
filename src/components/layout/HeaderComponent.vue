<template>
  <header class="bg-primary-600 text-white shadow-cute sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- 左侧：Logo和网站名称 -->
        <div class="flex items-center">
          <div class="text-xl md:text-2xl font-bold font-cute animate-wiggle">小学教育资源平台</div>
        </div>
        
        <!-- 中间：导航菜单 - 桌面端 -->
        <nav class="hidden lg:flex space-x-4 lg:space-x-6 flex-1 justify-center">
          <router-link v-for="item in visibleNavItems" :key="item.path" 
                      :to="item.path" 
                      class="transition-colors text-sm lg:text-base"
                      :class="{ 'text-accent-300 font-medium': isActiveRoute(item.path), 'hover:text-accent-300': !isActiveRoute(item.path) }">
            {{ item.name }}
          </router-link>
          
          <!-- 更多菜单下拉 -->
          <div class="relative" v-if="hiddenNavItems.length > 0">
            <button @click="toggleMoreMenu" class="flex items-center hover:text-accent-300 transition-colors text-sm lg:text-base">
              更多
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" :class="{ 'transform rotate-180': moreMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="moreMenuOpen" class="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-cute overflow-hidden z-100">
              <router-link v-for="(item) in hiddenNavItems" :key="item.path" 
                          :to="item.path" 
                          class="block px-4 py-2 text-sm"
                          :class="{ 'bg-primary-500 text-white': isActiveRoute(item.path), 'text-gray-700 hover:bg-primary-500 hover:text-white': !isActiveRoute(item.path) }"
                          @click="moreMenuOpen = false">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </nav>
        
        <!-- 右侧：用户登录/积分信息 -->
        <div class="flex items-center space-x-4">
          <!-- 积分显示 -->
          <div class="points-display-header">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-accent-300 mr-1">
                <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
              </svg>
              <span class="font-bold">{{ pointsStore.totalPoints }}</span>
            </div>
          </div>
          
          <!-- 登录按钮/用户信息 -->
          <div v-if="!userStore.isLoggedIn">
            <button 
              @click="loginModalOpen = true"
              class="bg-accent-400 text-white hover:bg-accent-500 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 shadow-cute hover:shadow-cute-lg hover:-translate-y-1"
            >
              登录
            </button>
          </div>
          
          <!-- 已登录状态 -->
          <div v-else class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-300 shadow-cute">
                <img 
                  v-if="userStore.user?.avatar" 
                  :src="userStore.user.avatar" 
                  alt="用户头像" 
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-primary-500 text-white text-sm font-medium">
                  {{ userStore.user?.name?.substring(0, 1) || '用' }}
                </div>
              </div>
              <span class="hidden md:inline">{{ userStore.user?.name || '用户' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'transform rotate-180': userMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- 用户菜单 -->
            <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-cute overflow-hidden z-100">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white">
                个人中心
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white">
                我的收藏
              </a>
              <button 
                @click="handleLogout" 
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-500 hover:text-white"
              >
                退出登录
              </button>
            </div>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <button @click="toggleMobileMenu" class="lg:hidden text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端折叠菜单 -->
      <div v-if="mobileMenuOpen" class="lg:hidden mt-4 pb-4">
        <router-link v-for="item in navItems" :key="item.path" 
                    :to="item.path" 
                    class="block py-2 transition-colors"
                    :class="{ 'text-accent-300 font-medium': isActiveRoute(item.path), 'hover:text-accent-300': !isActiveRoute(item.path) }"
                    @click="mobileMenuOpen = false">
          {{ item.name }}
        </router-link>
        <button 
          v-if="!userStore.isLoggedIn"
          @click="loginModalOpen = true; mobileMenuOpen = false"
          class="block w-full text-left py-2 hover:text-accent-300 transition-colors"
        >
          登录/注册
        </button>
        <button 
          v-else
          @click="handleLogout(); mobileMenuOpen = false"
          class="block w-full text-left py-2 hover:text-accent-300 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  </header>
  
  <!-- 登录模态框 -->
  <LoginModal :is-open="loginModalOpen" @close="closeLoginModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePointsStore } from '@/store/points';
import { useUserStore } from '@/store/user';
import { useRoute } from 'vue-router';
import LoginModal from '@/components/auth/LoginModal.vue';

const mobileMenuOpen = ref(false);
const moreMenuOpen = ref(false);
const userMenuOpen = ref(false);
const loginModalOpen = ref(false);
const windowWidth = ref(window.innerWidth);

const pointsStore = usePointsStore();
const userStore = useUserStore();
const route = useRoute();

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) {
    moreMenuOpen.value = false;
    userMenuOpen.value = false;
  }
};

const toggleMoreMenu = () => {
  moreMenuOpen.value = !moreMenuOpen.value;
  if (moreMenuOpen.value) {
    userMenuOpen.value = false;
  }
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
  if (userMenuOpen.value) {
    moreMenuOpen.value = false;
  }
};

const closeLoginModal = () => {
  loginModalOpen.value = false;
};

const handleLogout = () => {
  userStore.logout();
  userMenuOpen.value = false;
};

// 监听点击事件，点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative') && (moreMenuOpen.value || userMenuOpen.value)) {
    moreMenuOpen.value = false;
    userMenuOpen.value = false;
  }
};

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
  // 窗口大小变化时关闭菜单
  mobileMenuOpen.value = false;
  moreMenuOpen.value = false;
  userMenuOpen.value = false;
};

onMounted(() => {
  // 从本地存储加载用户信息
  userStore.loadUserFromStorage();
  
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});

const navItems = [
  { name: '首页', path: '/' },
  { name: '教育链接', path: '/education-links' },
  { name: '书籍推荐', path: '/books' },
  { name: '教育工具', path: '/edu-tools' },
  { name: '益智游戏', path: '/games' },
  { name: '办公工具', path: '/office-tools' },
  { name: '考试资源', path: '/exam-resources' },
  { name: '教育政策', path: '/policies' },
  { name: '比赛信息', path: '/competitions' },
];

// 根据屏幕宽度决定显示多少导航项
const visibleItemCount = computed(() => {
  if (windowWidth.value >= 1280) return 7; // xl
  if (windowWidth.value >= 1024) return 5; // lg
  return 0; // md and below
});

// 可见的导航项
const visibleNavItems = computed(() => {
  return navItems.slice(0, visibleItemCount.value);
});

// 隐藏的导航项（放入"更多"菜单）
const hiddenNavItems = computed(() => {
  return navItems.slice(visibleItemCount.value);
});

// 判断当前路由是否激活
const isActiveRoute = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
/* 添加过渡效果 */
.mt-4 {
  transition: max-height 0.3s ease-in-out;
}
</style>