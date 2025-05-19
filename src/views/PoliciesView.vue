<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">教育政策信息</h1>
    
    <!-- 分类标签 -->
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
          v-for="category in categories" 
          :key="category"
          @click="selectedCategory = category" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <!-- 时间轴 -->
    <div class="relative border-l-2 border-blue-500 ml-4 md:ml-8">
      <div 
        v-for="policy in filteredPolicies" 
        :key="policy.id"
        class="mb-10 ml-6"
      >
        <!-- 时间点 -->
        <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] mt-1.5"></div>
        
        <!-- 政策内容 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-wrap justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-gray-800">{{ policy.title }}</h3>
            <span class="text-sm text-gray-500">{{ policy.date }}</span>
          </div>
          
          <div class="mb-2">
            <span class="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ policy.category }}</span>
          </div>
          
          <p class="text-gray-600 mb-4">{{ policy.summary }}</p>
          
          <a :href="policy.url" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
            查看详情
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import policiesData from '../data/policies.json';

// 从配置文件读取分类和政策数据
const categories = ref(policiesData.categories);
const policies = ref(policiesData.policies);
const selectedCategory = ref('all');

// 根据选择的分类过滤政策
const filteredPolicies = computed(() => {
  if (selectedCategory.value === 'all') {
    return policies.value;
  } else {
    return policies.value.filter(policy => policy.category === selectedCategory.value);
  }
});
</script>