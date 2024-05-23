/**
 * 路由白名单配置文件，此处配置的路由，不需要通过鉴权。
 *
 * @author 白青东
 * @since 2024年4月26日 14点25分
 */

import { RouteRecordRaw } from 'vue-router';
import Login from '@/components/Login.vue';

export const RouterWhite: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/error/Error404Page.vue'),
  },
  {
    path: '/403',
    component: () => import('@/pages/error/Error403Page.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
];

/**
 * 获取白名单的路由path集合
 */
export const getWhitePaths = (): Array<string> => {
  return RouterWhite.map((item) => item.path);
};
