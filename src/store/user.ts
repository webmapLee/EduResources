// src/store/user.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<any>(null);
  const isLoggedIn = ref(false);

  // 从localStorage加载用户信息
  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem("eduResourcesUser");
    if (savedUser) {
      user.value = JSON.parse(savedUser);
      isLoggedIn.value = true;
    }
  };

  // 登录
  const login = (userData: any) => {
    user.value = userData;
    isLoggedIn.value = true;
    localStorage.setItem("eduResourcesUser", JSON.stringify(userData));
  };

  // 登出
  const logout = () => {
    user.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("eduResourcesUser");
  };

  return {
    user,
    isLoggedIn,
    loadUserFromStorage,
    login,
    logout,
  };
});
