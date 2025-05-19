<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-8 text-center">小学相关比赛</h1>
    
    <!-- 比赛类型筛选 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2 justify-center">
        <button 
          @click="selectedType = 'all'" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          全部比赛
        </button>
        <button 
          v-for="type in competitionTypes" 
          :key="type"
          @click="selectedType = type" 
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          :class="selectedType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          {{ type }}
        </button>
      </div>
    </div>
    
    <!-- 比赛列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="competition in filteredCompetitions" 
        :key="competition.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="p-6">
          <!-- 比赛标题和状态 -->
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-gray-800">{{ competition.title }}</h3>
            <span 
              class="text-xs font-semibold px-2 py-1 rounded-full"
              :class="getStatusClass(competition.status)"
            >
              {{ competition.status }}
            </span>
          </div>
          
          <!-- 比赛类型和适合年级 -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{{ competition.type }}</span>
            <span class="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{{ competition.gradeRange }}</span>
          </div>
          
          <!-- 比赛时间 -->
          <div class="flex items-center text-gray-600 text-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ competition.date }}</span>
          </div>
          
          <!-- 比赛描述 -->
          <p class="text-gray-600 mb-4">{{ competition.description }}</p>
          
          <!-- 比赛链接 -->
          <a :href="competition.url" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
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
import competitionsData from '../data/competitions.json';

// 从配置文件读取比赛类型和比赛数据
const competitionTypes = ref(competitionsData.types);
const competitions = ref(competitionsData.competitions);
const selectedType = ref('all');

// 根据选择的类型过滤比赛
const filteredCompetitions = computed(() => {
  if (selectedType.value === 'all') {
    return competitions.value;
  } else {
    return competitions.value.filter(competition => competition.type === selectedType.value);
  }
});

// 获取状态对应的样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case '报名中':
      return 'bg-green-100 text-green-800';
    case '进行中':
      return 'bg-blue-100 text-blue-800';
    case '即将开始':
      return 'bg-yellow-100 text-yellow-800';
    case '已结束':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>