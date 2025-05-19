<template>
  <div class="home-container relative z-0">
    <!-- 英雄区域 -->
    <section class="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-12 md:py-20 relative overflow-hidden">
      <!-- 装饰性波浪背景 -->
      <div class="absolute inset-0 wave-animation"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-cute animate-float">
              小学教育资源平台
            </h1>
            <p class="text-lg md:text-xl mb-6 text-white/90 max-w-lg">
              为小学教师和学生提供优质的教育资源和工具，助力教学与学习。
            </p>
            <div class="flex flex-wrap gap-4">
              <router-link to="/education-links" class="cute-button bg-accent-500 hover:bg-accent-600">
                浏览资源
              </router-link>
              <router-link to="/office-tools" class="cute-button bg-white text-primary-600 hover:bg-gray-100">
                使用工具
              </router-link>
            </div>
          </div>
          
          <div class="md:w-1/2 flex justify-center">
            <div class="w-full max-w-md">
              <lottie-animation 
                :animation-data="educationAnimationData" 
                :width="300" 
                :height="300" 
                :loop="true" 
                :autoplay="true" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 特色模块 -->
    <section class="py-12 bg-secondary-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8 text-primary-700 font-cute">特色模块</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <module-card
            v-for="module in featuredModules"
            :key="module.title"
            :title="module.title"
            :description="module.description"
            :link="module.link"
          />
        </div>
      </div>
    </section>
    
    <!-- 最新资源 -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-primary-700 font-cute">最新资源</h2>
          <router-link to="/education-links" class="text-primary-600 hover:text-primary-800 flex items-center">
            查看全部
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <resource-card
            v-for="resource in latestResources"
            :key="resource.title"
            :title="resource.title"
            :description="resource.description"
            :link="resource.link"
            :image="resource.image"
            :date="resource.date"
            :views="resource.views"
            :tags="resource.tags"
          />
        </div>
      </div>
    </section>
    
    <!-- 积分排行榜 -->
    <section class="py-12 bg-secondary-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8 text-primary-700 font-cute">积分排行榜</h2>
        
        <div class="bg-white rounded-2xl shadow-cute p-6 max-w-2xl mx-auto">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div class="font-medium text-gray-500">排名</div>
            <div class="font-medium text-gray-500">用户</div>
            <div class="font-medium text-gray-500">积分</div>
          </div>
          
          <div v-for="(user, index) in leaderboard" :key="user.id" class="flex items-center justify-between py-3">
            <div class="flex items-center">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                :class="{
                  'bg-accent-400 text-white': index === 0,
                  'bg-accent-300 text-white': index === 1,
                  'bg-accent-200 text-accent-800': index === 2,
                  'bg-gray-100 text-gray-600': index > 2
                }"
              >
                {{ index + 1 }}
              </div>
            </div>
            
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-primary-500 text-white">
                  {{ user.name.substring(0, 1) }}
                </div>
              </div>
              <span class="font-medium">{{ user.name }}</span>
            </div>
            
            <div class="font-bold text-primary-600">{{ user.points }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ModuleCard from '@/components/modules/ModuleCard.vue';
import ResourceCard from '@/components/modules/ResourceCard.vue';
import LottieAnimation from '@/components/LottieAnimation.vue';
import educationAnimationData from '@/assets/animations/education-animation.json';

// 特色模块数据
const featuredModules = [
  {
    title: '教育链接',
    description: '精选优质教育网站链接，包括教学资源、教案、课件等内容，助力教师备课和学生学习。',
    link: '/education-links'
  },
  {
    title: '办公工具',
    description: '提供常用办公工具，如文档处理、表格制作、幻灯片设计等，提高工作效率。',
    link: '/office-tools'
  },
  {
    title: '考试资源',
    description: '汇集各类考试资源，包括试卷、练习题、答案解析等，帮助学生备考和提高成绩。',
    link: '/exam-resources'
  }
];

// 最新资源数据
const latestResources = [
  {
    title: '小学语文教学课件',
    description: '包含小学1-6年级语文教学课件，内容丰富，图文并茂，适合课堂教学使用。',
    link: '#',
    image: 'https://picsum.photos/seed/edu1/300/200',
    date: '2023-09-15',
    views: 1256,
    tags: ['语文', '课件']
  },
  {
    title: '数学思维训练题集',
    description: '精选数学思维训练题，培养学生逻辑思维能力和解题能力，适合课后练习。',
    link: '#',
    image: 'https://picsum.photos/seed/edu2/300/200',
    date: '2023-09-10',
    views: 986,
    tags: ['数学', '思维训练']
  },
  {
    title: '英语单词记忆方法',
    description: '介绍多种英语单词记忆方法和技巧，帮助学生高效记忆英语单词，提高学习效率。',
    link: '#',
    image: 'https://picsum.photos/seed/edu3/300/200',
    date: '2023-09-05',
    views: 754,
    tags: ['英语', '学习方法']
  }
];

// 积分排行榜数据
const leaderboard = [
  { id: 1, name: '张老师', points: 1250, avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 2, name: '李老师', points: 980, avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 3, name: '王老师', points: 875, avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 4, name: '赵老师', points: 720, avatar: 'https://picsum.photos/seed/user4/100/100' },
  { id: 5, name: '刘老师', points: 650, avatar: 'https://picsum.photos/seed/user5/100/100' }
];
</script>