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
      <FullscreenFrame 
        :src="activeGame.url" 
        :title="activeGame.title" 
        v-model:isFullscreen="isFullscreen"
        @close="closeGame"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePointsStore } from '../store/points';
import gamesData from '../data/games.json';
import FullscreenFrame from '../components/FullscreenFrame.vue';

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