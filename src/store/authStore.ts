import { defineStore } from 'pinia';
import { logout } from '@/api/auth.api';
import { removeToken } from '@/utils/TokenUtil';
import router from '@/router/index';

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
    handleLogout() {
      logout().finally(() => {
        removeToken();
        router.push('/login');
      });
    },
  },
});
