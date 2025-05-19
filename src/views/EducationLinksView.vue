<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">在线教育链接</h1>
    
    <!-- 分类筛选 -->
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
          :key="category.id"
          @click="selectedCategory = category.id" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
    
    <!-- 链接列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="bg-blue-500 text-white px-4 py-3">
          <h2 class="text-xl font-bold">{{ category.name }}</h2>
        </div>
        
        <ul class="divide-y divide-gray-200">
          <li v-for="link in category.links" :key="link.id" class="p-4 hover:bg-gray-50">
            <a :href="link.url" target="_blank" class="block">
              <h3 class="text-lg font-semibold text-blue-600 mb-1">{{ link.title }}</h3>
              <p class="text-gray-600 text-sm">{{ link.description }}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import educationLinksData from '../data/educationLinks.json';

// 类型定义
interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  links: Link[];
}

// 数据
const categories = ref<Category[]>(educationLinksData.categories);
const selectedCategory = ref('all');

// 根据选择的分类过滤链接
const filteredCategories = computed(() => {
  if (selectedCategory.value === 'all') {
    return categories.value;
  } else {
    return categories.value.filter(category => category.id === selectedCategory.value);
  }
});

// 记录模块访问积分
onMounted(() => {
  // 这里已经在路由守卫中处理了积分记录
});
</script>