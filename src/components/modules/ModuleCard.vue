<template>
  <div class="cute-card group hover:bg-primary-50 transition-all duration-300">
    <div class="flex flex-col h-full">
      <!-- 图标 -->
      <div class="mb-4 flex justify-center">
        <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center group-hover:animate-wiggle">
          <component 
            :is="icon" 
            class="w-8 h-8 text-primary-600"
            v-if="icon"
          />
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
      
      <!-- 标题 -->
      <h3 class="text-lg font-bold text-primary-700 mb-2 text-center">{{ title }}</h3>
      
      <!-- 描述 -->
      <p class="text-gray-600 text-sm mb-4 flex-grow">{{ description }}</p>
      
      <!-- 按钮 -->
      <div class="mt-auto">
        <router-link 
          :to="link" 
          class="cute-button w-full flex items-center justify-center"
        >
          <span>查看详情</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
  icon: {
    type: Object,
    default: null
  }
});
</script>