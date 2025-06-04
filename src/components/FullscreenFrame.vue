<template>
  <div>
    <div v-if="isFullscreen" class="fixed inset-0 bg-black w-screen h-screen z-50">
      <div class="absolute top-4 right-4 flex space-x-2 z-10">
        <button @click="toggleFullscreen" class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
        <button @click="close" class="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <iframe 
        :src="src" 
        class="w-full h-full border-0 min-w-[600px]"
        ref="frame"
        allowfullscreen
      ></iframe>
    </div>
    <div v-else class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-xl font-bold">{{ title }}</h3>
        <div class="flex items-center">
          <button @click="toggleFullscreen" class="text-gray-500 hover:text-gray-700 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
          <button @click="close" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="flex-grow p-4 overflow-auto">
        <iframe 
          :src="src" 
          class="w-full border-0 rounded-lg h-[60vh] min-w-[600px]"
          ref="frame"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  src: string;
  title: string;
  isFullscreen: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isFullscreen', value: boolean): void;
  (e: 'close'): void;
}>();

const frame = ref<HTMLIFrameElement | null>(null);

// 切换全屏模式
const toggleFullscreen = () => {
  emit('update:isFullscreen', !props.isFullscreen);
};

// 关闭
const close = () => {
  emit('close');
};

// 监听全屏状态变化，控制滚动条
watch(() => props.isFullscreen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'; // 隐藏滚动条
  } else {
    document.body.style.overflow = ''; // 恢复滚动条
  }
});
</script>