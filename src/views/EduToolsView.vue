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
      <FullscreenFrame 
        :src="activeTool.url" 
        :title="activeTool.name" 
        v-model:isFullscreen="isFullscreen"
        @close="closeTool"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePointsStore } from '../store/points';
import toolsData from '../data/tools.json';
import FullscreenFrame from '../components/FullscreenFrame.vue';

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