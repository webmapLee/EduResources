<template>
  <div class="cute-card group hover:bg-primary-50">
    <!-- 资源图片 -->
    <div class="relative overflow-hidden rounded-xl mb-4 h-40">
      <img 
        v-if="image" 
        :src="image" 
        :alt="title" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div 
        v-else 
        class="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      
      <!-- 标签 -->
      <div v-if="tags && tags.length" class="absolute top-2 right-2 flex flex-wrap justify-end gap-1">
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="bg-accent-500 text-white text-xs px-2 py-1 rounded-full shadow-cute"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- 内容 -->
    <div>
      <h3 class="text-lg font-bold text-primary-700 mb-1">{{ title }}</h3>
      
      <div class="flex items-center text-xs text-gray-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ formatDate(date) }}</span>
        
        <div class="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
        
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{{ views }}</span>
      </div>
      
      <p class="text-gray-600 text-sm mb-4">{{ description }}</p>
      
      <!-- 操作按钮 -->
      <div class="flex justify-between items-center">
        <a 
          :href="link" 
          target="_blank" 
          class="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center transition-colors"
        >
          查看详情
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <button 
          @click="toggleFavorite" 
          class="text-gray-400 hover:text-accent-500 transition-colors"
          :class="{ 'text-accent-500': isFavorite }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  date: {
    type: [Date, String],
    default: new Date()
  },
  views: {
    type: [Number, String],
    default: 0
  },
  tags: {
    type: Array as () => string[],
    default: () => []
  }
});

const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
</script>