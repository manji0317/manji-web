import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: (): AuthUser => ({
    id: 0,
    username: '',
    email: '',
    phone: '',
    avatar: '',
    menuIds: [],
  }),
  getters: {},
  actions: {
    // 退出系统
    handleLogout() {},
  },
});
