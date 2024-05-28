import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: (): AuthUser => ({
    id: '',
    nickname: '',
    username: '',
    email: '',
    phone: '',
    gender: 1,
    birthday: '',
    avatar: '',
    status: 1,
    menus: [],
  }),
  getters: {},
  actions: {
    // 退出系统
    handleLogout() {},
  },
});
