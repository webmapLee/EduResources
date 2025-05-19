<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">教育类工具</h1>
    
    <!-- 工具分类 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <button 
          @click="selectedCategory = 'all'" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          全部工具
        </button>
        <button 
          v-for="category in toolCategories" 
          :key="category"
          @click="selectedCategory = category" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <!-- 工具列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="tool in filteredTools" 
        :key="tool.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-3 rounded-full mr-4">
              <div v-html="tool.icon"></div>
            </div>
            <h3 class="text-xl font-bold text-gray-800">{{ tool.name }}</h3>
          </div>
          
          <p class="text-gray-600 mb-4">{{ tool.description }}</p>
          
          <button 
            @click="openTool(tool)"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            使用工具
          </button>
        </div>
      </div>
    </div>
    
    <!-- 工具弹窗 -->
    <div v-if="activeTool" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" :class="{ 'max-w-none h-screen': isFullscreen }">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-xl font-bold">{{ activeTool.name }}</h3>
          <div class="flex items-center">
            <button @click="toggleFullscreen" class="text-gray-500 hover:text-gray-700 mr-2">
              <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0h5m-5 0v5m16-5l-5 5m5 0v-5m0 5h-5m-11 5l5 5m0 0h-5m5 0v-5m5 5l5-5m0 0v5m0-5h-5" />
              </svg>
            </button>
            <button @click="closeTool" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex-grow p-4 overflow-auto">
          <iframe 
            v-if="activeTool" 
            :src="activeTool.url" 
            class="w-full border-0 rounded-lg"
            :class="isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[60vh]'"
            ref="toolFrame"
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
import toolsData from '../data/tools.json';

const pointsStore = usePointsStore();

// 从配置文件读取工具分类和工具数据
const toolCategories = ref(toolsData.categories);
const tools = ref(toolsData.tools);

const activeTool = ref<any>(null);
const toolFrame = ref<HTMLIFrameElement | null>(null);
const selectedCategory = ref('all');
const isFullscreen = ref(false);

// 根据选择的分类过滤工具
const filteredTools = computed(() => {
  if (selectedCategory.value === 'all') {
    return tools.value;
  } else {
    return tools.value.filter(tool => tool.category === selectedCategory.value);
  }
});

// 打开工具
const openTool = (tool: any) => {
  activeTool.value = tool;
  
  // 记录模块访问积分
  pointsStore.recordModuleVisit('eduTools');
};

// 关闭工具
const closeTool = () => {
  activeTool.value = null;
  isFullscreen.value = false;
};

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 监听工具使用完成消息
const handleToolMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'toolUsed') {
    // 记录工具使用积分
    pointsStore.recordModuleVisit('eduTools');
  }
};

onMounted(() => {
  window.addEventListener('message', handleToolMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleToolMessage);
});
</script>