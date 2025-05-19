import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePointsStore = defineStore('points', () => {
  // 状态
  const points = ref(0)
  const lastVisitDate = ref('')
  const moduleVisits = ref<Record<string, number>>({})
  const gameCompletions = ref(0)
  const stayTimePoints = ref(0)
  
  // 获取总积分
  const totalPoints = computed(() => points.value)
  
  // 初始化积分系统
  function initPoints() {
    const savedPoints = localStorage.getItem('eduResourcesPoints')
    const savedLastVisit = localStorage.getItem('eduResourcesLastVisit')
    const savedModuleVisits = localStorage.getItem('eduResourcesModuleVisits')
    const savedGameCompletions = localStorage.getItem('eduResourcesGameCompletions')
    const savedStayTimePoints = localStorage.getItem('eduResourcesStayTimePoints')
    
    if (savedPoints) points.value = parseInt(savedPoints)
    if (savedLastVisit) lastVisitDate.value = savedLastVisit
    if (savedModuleVisits) moduleVisits.value = JSON.parse(savedModuleVisits)
    if (savedGameCompletions) gameCompletions.value = parseInt(savedGameCompletions)
    if (savedStayTimePoints) stayTimePoints.value = parseInt(savedStayTimePoints)
    
    // 每天重置模块访问和游戏完成计数
    const today = new Date().toISOString().split('T')[0]
    if (lastVisitDate.value !== today) {
      moduleVisits.value = {}
      gameCompletions.value = 0
      stayTimePoints.value = 0
    }
  }
  
  // 保存积分到本地存储
  function savePoints() {
    localStorage.setItem('eduResourcesPoints', points.value.toString())
    localStorage.setItem('eduResourcesLastVisit', lastVisitDate.value)
    localStorage.setItem('eduResourcesModuleVisits', JSON.stringify(moduleVisits.value))
    localStorage.setItem('eduResourcesGameCompletions', gameCompletions.value.toString())
    localStorage.setItem('eduResourcesStayTimePoints', stayTimePoints.value.toString())
  }
  
  // 记录每日访问积分
  function recordDailyVisit() {
    const today = new Date().toISOString().split('T')[0]
    
    if (lastVisitDate.value !== today) {
      // 每日首次访问奖励5分
      points.value += 5
      lastVisitDate.value = today
      savePoints()
      return true
    }
    
    return false
  }
  
  // 记录模块访问积分
  function recordModuleVisit(moduleName: string) {
    if (!moduleVisits.value[moduleName]) {
      moduleVisits.value[moduleName] = 0
    }
    
    // 每个模块每天最多奖励两次，每次3分
    if (moduleVisits.value[moduleName] < 2) {
      moduleVisits.value[moduleName]++
      points.value += 3
      savePoints()
      return true
    }
    
    return false
  }
  
  // 记录游戏完成积分
  function recordGameCompletion() {
    // 每天最多奖励2次游戏完成，每次10分
    if (gameCompletions.value < 2) {
      gameCompletions.value++
      points.value += 10
      savePoints()
      return true
    }
    
    return false
  }
  
  // 记录停留时间积分
  function recordStayTime() {
    // 每5分钟奖励2分，每天最多奖励10次（20分）
    if (stayTimePoints.value < 10) {
      stayTimePoints.value++
      points.value += 2
      savePoints()
      return true
    }
    
    return false
  }
  
  return {
    points,
    totalPoints,
    initPoints,
    recordDailyVisit,
    recordModuleVisit,
    recordGameCompletion,
    recordStayTime
  }
})