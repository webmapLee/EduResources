<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">在线考试资源</h1>
    
    <!-- 筛选器 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-4 justify-center mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">年级</label>
          <select v-model="selectedGrade" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="all">全部年级</option>
            <option v-for="grade in grades" :key="grade" :value="grade">{{ grade }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">学科</label>
          <select v-model="selectedSubject" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="all">全部学科</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 资源列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="resource in filteredResources" 
        :key="resource.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <a :href="resource.url" target="_blank" class="block">
          <div class="p-6">
            <div class="flex items-center mb-2">
              <span class="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ resource.grade }}</span>
              <span class="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full ml-2">{{ resource.subject }}</span>
            </div>
            
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ resource.title }}</h3>
            <p class="text-gray-600 mb-4">{{ resource.description }}</p>
            
            <div class="flex items-center text-blue-600">
              <span>查看资源</span>
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
import { ref, computed } from 'vue';
import examResourcesData from '../data/examResources.json';

// 从配置文件读取筛选选项和资源数据
const grades = ref(examResourcesData.grades);
const subjects = ref(examResourcesData.subjects);
const examResources = ref(examResourcesData.resources);

const selectedGrade = ref('all');
const selectedSubject = ref('all');

// 根据筛选条件过滤资源
const filteredResources = computed(() => {
  return examResources.value.filter(resource => {
    const gradeMatch = selectedGrade.value === 'all' || resource.grade === selectedGrade.value;
    const subjectMatch = selectedSubject.value === 'all' || resource.subject === selectedSubject.value;
    return gradeMatch && subjectMatch;
  });
});
</script>