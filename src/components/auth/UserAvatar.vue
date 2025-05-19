<template>
  <div class="relative">
    <!-- 未登录状态 -->
    <button 
      v-if="!userStore.isLoggedIn" 
      @click="openLoginModal" 
      class="flex items-center text-white hover:text-yellow-300 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="hidden md:inline">登录</span>
    </button>
    
    <!-- 已登录状态 -->
    <div v-else class="flex items-center">
      <button @click="toggleUserMenu" class="flex items-center">
        <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-300 mr-2">
          <img 
            v-if="userStore.user?.avatar" 
            :src="userStore.user.avatar" 
            alt="用户头像" 
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 text-white text-sm font-medium">
            {{ userStore.user?.name?.substring(0, 1) || '用' }}
          </div>
        </div>
        <span class="hidden md:inline text-white hover:text-yellow-300 transition-colors">
          {{ userStore.user?.name || '用户' }}
        </span>
      </button>
      
      <!-- 用户菜单 -->
      <div 
        v-if="userMenuOpen" 
        class="absolute right-0 mt-12 w-48 bg-white rounded-md shadow-lg py-1 z-50"
      >
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          个人中心
        </a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          我的收藏
        </a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white">
          学习记录
        </a>
        <button 
          @click="handleLogout" 
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
        >
          退出登录
        </button>
      </div>
    </div>
    
    <!-- 登录模态框 -->
    <LoginModal :is-open="loginModalOpen" @close="closeLoginModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/store/user';
import LoginModal from './LoginModal.vue';

const userStore = useUserStore();
const loginModalOpen = ref(false);
const userMenuOpen = ref(false);

// 打开登录模态框
const openLoginModal = () => {
  loginModalOpen.value = true;
};

// 关闭登录模态框
const closeLoginModal = () => {
  loginModalOpen.value = false;
};

// 切换用户菜单
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

// 退出登录
const handleLogout = () => {
  userStore.logout();
  userMenuOpen.value = false;
};

// 监听点击事件，点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative') && userMenuOpen.value) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  // 从本地存储加载用户信息
  userStore.loadUserFromStorage();
  
  // 添加点击事件监听
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>