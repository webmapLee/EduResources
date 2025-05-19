<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">在线办公工具</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="tool in tools" 
        :key="tool.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <a :href="tool.url" target="_blank" class="block">
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="bg-blue-100 p-3 rounded-full mr-4">
                <div v-html="tool.icon"></div>
              </div>
              <h3 class="text-xl font-bold text-gray-800">{{ tool.name }}</h3>
            </div>
            <p class="text-gray-600 mb-4">{{ tool.description }}</p>
            <div class="flex items-center text-blue-600">
              <span>访问工具</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import officeToolsData from '../data/officeTools.json';

// 从配置文件读取办公工具数据
const tools = ref(officeToolsData.tools);
</script>