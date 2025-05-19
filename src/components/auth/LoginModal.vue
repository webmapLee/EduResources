<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
    
    <!-- 登录框 -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 overflow-hidden">
      <!-- 标题栏 -->
      <div class="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
        <h3 class="text-xl font-medium">用户登录</h3>
        <button @click="closeModal" class="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 登录选项卡 -->
      <div class="flex border-b">
        <button 
          @click="activeTab = 'phone'" 
          class="flex-1 py-3 font-medium text-center transition-colors"
          :class="activeTab === 'phone' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'"
        >
          手机验证码登录
        </button>
        <button 
          @click="activeTab = 'wechat'" 
          class="flex-1 py-3 font-medium text-center transition-colors"
          :class="activeTab === 'wechat' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-blue-500'"
        >
          微信登录
        </button>
      </div>
      
      <!-- 手机验证码登录 -->
      <div v-if="activeTab === 'phone'" class="p-6">
        <form @submit.prevent="handlePhoneLogin">
          <div class="mb-4">
            <label for="phone" class="block text-gray-700 text-sm font-medium mb-2">手机号码</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="phoneForm.phone" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入手机号码"
              required
              pattern="^1[3-9]\d{9}$"
            />
          </div>
          
          <div class="mb-6">
            <label for="code" class="block text-gray-700 text-sm font-medium mb-2">验证码</label>
            <div class="flex">
              <input 
                type="text" 
                id="code" 
                v-model="phoneForm.code" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入验证码"
                required
              />
              <button 
                type="button" 
                @click="sendCode" 
                :disabled="cooldown > 0"
                class="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {{ cooldown > 0 ? `${cooldown}秒后重发` : '获取验证码' }}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isLoading"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>
      </div>
      
      <!-- 微信登录 -->
      <div v-if="activeTab === 'wechat'" class="p-6 flex flex-col items-center">
        <div class="text-center mb-4">
          <p class="text-gray-600">请使用微信扫描二维码登录</p>
        </div>
        
        <div class="bg-gray-100 p-4 rounded-lg mb-6 flex justify-center items-center">
          <!-- 这里可以放置微信登录二维码或按钮 -->
          <button 
            @click="handleWechatLogin" 
            class="flex items-center justify-center bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            :disabled="isLoading"
          >
            <svg class="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.686 13.991c-1.170 0-2.12-.95-2.12-2.12s.95-2.12 2.12-2.12 2.12.95 2.12 2.12-.95 2.12-2.12 2.12zm6.628 0c-1.17 0-2.12-.95-2.12-2.12s.95-2.12 2.12-2.12 2.12.95 2.12 2.12-.95 2.12-2.12 2.12z"/>
              <path d="M12 22.25C6.348 22.25 1.75 17.652 1.75 12S6.348 1.75 12 1.75 22.25 6.348 22.25 12 17.652 22.25 12 22.25zm-3.314-12.78c-1.613 0-2.92 1.307-2.92 2.92s1.307 2.92 2.92 2.92 2.92-1.307 2.92-2.92-1.307-2.92-2.92-2.92zm6.628 0c-1.613 0-2.92 1.307-2.92 2.92s1.307 2.92 2.92 2.92 2.92-1.307 2.92-2.92-1.307-2.92-2.92-2.92z"/>
            </svg>
            微信登录
          </button>
        </div>
      </div>
      
      <!-- 底部提示 -->
      <div class="px-6 py-4 bg-gray-50 text-center text-sm text-gray-600">
        登录即表示您同意我们的
        <a href="#" class="text-blue-500 hover:underline">服务条款</a>
        和
        <a href="#" class="text-blue-500 hover:underline">隐私政策</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/user';
import { sendPhoneCode, loginWithPhoneCode, getWechatLoginUrl } from '@/services/authService';

// 定义 isOpen 作为 prop
defineProps<{
  isOpen: boolean
}>();


const emit = defineEmits<{
  (e: 'close'): void;
}>();

const userStore = useUserStore();
const activeTab = ref('phone');
const isLoading = ref(false);
const cooldown = ref(0);

// 手机登录表单
const phoneForm = reactive({
  phone: '',
  code: ''
});

// 关闭模态框
const closeModal = () => {
  emit('close');
};

// 发送验证码
const sendCode = async () => {
  if (!phoneForm.phone || !/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    alert('请输入正确的手机号码');
    return;
  }
  
  try {
    isLoading.value = true;
    await sendPhoneCode(phoneForm.phone);
    
    // 开始倒计时
    cooldown.value = 60;
    const timer = setInterval(() => {
      cooldown.value--;
      if (cooldown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
  } catch (error) {
    alert('发送验证码失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
};

// 手机验证码登录
const handlePhoneLogin = async () => {
  if (!phoneForm.phone || !phoneForm.code) {
    alert('请填写完整信息');
    return;
  }
  
  try {
    isLoading.value = true;
    const response = await loginWithPhoneCode({
      phone: phoneForm.phone,
      code: phoneForm.code
    });
    
    // 登录成功，保存用户信息
    userStore.login({
      id: response.user.id,
      name: response.user.name,
      avatar: response.user.avatar,
      phone: response.user.phone,
      token: response.token
    });
    
    closeModal();
  } catch (error) {
    alert('登录失败，请检查手机号和验证码是否正确');
  } finally {
    isLoading.value = false;
  }
};

// 微信登录
const handleWechatLogin = () => {
  // 获取微信登录URL并跳转
  const url = getWechatLoginUrl();
  window.open(url, '_blank', 'width=800,height=600');
};
</script>