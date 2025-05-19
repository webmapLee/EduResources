<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">{{ statusMessage }}</h1>
        
        <div v-if="isLoading" class="my-8">
          <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="mt-4 text-gray-600">正在处理微信登录，请稍候...</p>
        </div>
        
        <div v-else-if="isSuccess" class="my-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <p class="mt-4 text-gray-600">登录成功！即将返回首页...</p>
        </div>
        
        <div v-else class="my-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p class="mt-4 text-gray-600">{{ errorMessage }}</p>
        </div>
        
        <button 
          @click="goToHome" 
          class="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { loginWithWechat } from '@/services/authService';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isLoading = ref(true);
const isSuccess = ref(false);
const statusMessage = ref('微信登录处理中');
const errorMessage = ref('');

onMounted(async () => {
  // 从URL获取微信授权码
  const code = route.query.code as string;
  
  if (!code) {
    isLoading.value = false;
    statusMessage.value = '登录失败';
    errorMessage.value = '未获取到授权码，请重新登录';
    return;
  }
  
  try {
    // 调用微信登录API
    const response = await loginWithWechat({ code });
    
    // 登录成功，保存用户信息
    userStore.login({
      id: response.user.id,
      name: response.user.name,
      avatar: response.user.avatar,
      token: response.token
    });
    
    isSuccess.value = true;
    statusMessage.value = '登录成功';
    
    // 3秒后自动跳转到首页
    setTimeout(() => {
      router.push('/');
    }, 3000);
    
  } catch (error) {
    statusMessage.value = '登录失败';
    errorMessage.value = '微信登录验证失败，请重新尝试';
  } finally {
    isLoading.value = false;
  }
});

// 返回首页
const goToHome = () => {
  router.push('/');
};
</script>