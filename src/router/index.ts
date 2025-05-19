import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/education-links',
      name: 'educationLinks',
      component: () => import('../views/EducationLinksView.vue')
    },
    {
      path: '/office-tools',
      name: 'officeTools',
      component: () => import('../views/OfficeToolsView.vue')
    },
    {
      path: '/exam-resources',
      name: 'examResources',
      component: () => import('../views/ExamResourcesView.vue')
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue')
    },
    {
      path: '/policies',
      name: 'policies',
      component: () => import('../views/PoliciesView.vue')
    },
    {
      path: '/competitions',
      name: 'competitions',
      component: () => import('../views/CompetitionsView.vue')
    },
    {
      path: '/edu-tools',
      name: 'eduTools',
      component: () => import('../views/EduToolsView.vue')
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue')
    },
    {
      path: '/wechat-callback',
      name: 'wechatCallback',
      component: () => import('../views/WechatCallback.vue')
    }
  ]
})

// 路由变化时记录模块访问积分
import { usePointsStore } from '../store/points'

router.afterEach((to) => {
  if (to.name && to.name !== 'home') {
    const pointsStore = usePointsStore()
    pointsStore.recordModuleVisit(to.name.toString())
  }
})

export default router