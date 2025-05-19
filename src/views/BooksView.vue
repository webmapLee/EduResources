<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-primary-600 mb-8 text-center">儿童相关书籍推荐</h1>
    
    <!-- 分类筛选 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <button 
          @click="selectedCategory = 'all'" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          全部
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category.id" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedCategory === category.id ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
    
    <!-- 书籍列表 -->
    <div v-for="category in filteredCategories" :key="category.id" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ category.name }}</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="book in category.books" 
          :key="book.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- 书籍封面 -->
          <div class="h-48 bg-gray-200 relative">
            <div class="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <img 
              v-if="false" 
              :src="book.cover" 
              :alt="book.title" 
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- 书籍信息 -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-1">{{ book.title }}</h3>
            <p v-if="book.author" class="text-sm text-gray-600 mb-2">作者: {{ book.author }}</p>
            <p class="text-sm text-gray-600 mb-3">{{ book.description }}</p>
            
            <!-- 外部链接 -->
            <div class="flex space-x-2 mt-2">
              <a 
                v-if="book.doubanLink" 
                :href="book.doubanLink" 
                target="_blank" 
                class="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors flex items-center"
              >
                <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                </svg>
                豆瓣
              </a>
              <a 
                v-if="book.wechatLink" 
                :href="book.wechatLink" 
                target="_blank" 
                class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center"
              >
                <svg class="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5,7A1.5,1.5 0 0,0 7,8.5A1.5,1.5 0 0,0 8.5,10A1.5,1.5 0 0,0 10,8.5A1.5,1.5 0 0,0 8.5,7M13.5,7A1.5,1.5 0 0,0 12,8.5A1.5,1.5 0 0,0 13.5,10A1.5,1.5 0 0,0 15,8.5A1.5,1.5 0 0,0 13.5,7M8.5,14A1.5,1.5 0 0,0 7,15.5A1.5,1.5 0 0,0 8.5,17A1.5,1.5 0 0,0 10,15.5A1.5,1.5 0 0,0 8.5,14M13.5,14A1.5,1.5 0 0,0 12,15.5A1.5,1.5 0 0,0 13.5,17A1.5,1.5 0 0,0 15,15.5A1.5,1.5 0 0,0 13.5,14M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                </svg>
                微信读书
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import booksData from '../data/books.json';

// 类型定义
interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  doubanLink?: string;
  wechatLink?: string;
}

interface Category {
  id: string;
  name: string;
  books: Book[];
}

// 数据
const categories = ref<Category[]>(booksData.categories);
const selectedCategory = ref('all');

// 根据选择的分类过滤书籍
const filteredCategories = computed(() => {
  if (selectedCategory.value === 'all') {
    return categories.value;
  } else {
    return categories.value.filter(category => category.id === selectedCategory.value);
  }
});
</script>