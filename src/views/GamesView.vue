<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">益智类游戏</h1>
    
    <!-- 游戏分类 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <button 
          @click="selectedCategory = 'all'" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          全部
        </button>
        <button 
          v-for="category in gameCategories" 
          :key="category.id"
          @click="selectedCategory = category.id" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
    
    <!-- 游戏列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div 
        v-for="game in filteredGames" 
        :key="game.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <!-- 游戏封面 -->
        <div class="h-48 bg-gray-200 relative">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <!-- 游戏信息 -->
        <div class="p-6">
          <div class="flex items-center mb-2">
            <span class="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ getCategoryName(game.categoryId) }}</span>
            <span class="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full ml-2">{{ game.ageRange }}</span>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ game.title }}</h3>
          <p class="text-gray-600 mb-4">{{ game.description }}</p>
          
          <button 
            @click="startGame(game)"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            开始游戏
          </button>
        </div>
      </div>
    </div>
    
    <!-- 游戏弹窗 -->
    <div v-if="activeGame" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" :class="{ 'max-w-none h-screen': isFullscreen }">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-xl font-bold">{{ activeGame.title }}</h3>
          <div class="flex items-center">
            <button @click="toggleFullscreen" class="text-gray-500 hover:text-gray-700 mr-2">
              <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0h5m-5 0v5m16-5l-5 5m5 0v-5m0 5h-5m-11 5l5 5m0 0h-5m5 0v-5m5 5l5-5m0 0v5m0-5h-5" />
              </svg>
            </button>
            <button @click="closeGame" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex-grow p-4 overflow-auto">
          <iframe 
            v-if="activeGame" 
            :src="activeGame.url" 
            class="w-full border-0 rounded-lg"
            :class="isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[60vh]'"
            ref="gameFrame"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePointsStore } from '../store/points';
import gamesData from '../data/games.json';

const pointsStore = usePointsStore();

// 从配置文件读取游戏分类和游戏数据
const gameCategories = ref(gamesData.categories);
const games = ref(gamesData.games);

const selectedCategory = ref('all');
const activeGame = ref<any>(null);
const gameFrame = ref<HTMLIFrameElement | null>(null);
const isFullscreen = ref(false);

// 根据选择的分类过滤游戏
const filteredGames = computed(() => {
  if (selectedCategory.value === 'all') {
    return games.value;
  } else {
    return games.value.filter(game => game.categoryId === selectedCategory.value);
  }
});

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = gameCategories.value.find(cat => cat.id === categoryId);
  return category ? category.name : '';
};

// 开始游戏
const startGame = (game: any) => {
  activeGame.value = game;
};

// 关闭游戏
const closeGame = () => {
  activeGame.value = null;
  isFullscreen.value = false;
};

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 监听游戏完成消息
const handleGameMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'gameCompleted') {
    // 记录游戏完成积分
    pointsStore.recordGameCompletion();
    
    // 显示完成消息
    alert('恭喜你完成了游戏！获得10积分奖励！');
  }
};

onMounted(() => {
  window.addEventListener('message', handleGameMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleGameMessage);
});
</script>