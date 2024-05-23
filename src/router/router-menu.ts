import type { CustomRouteRecordRaw, RouteRecordRaw } from 'vue-router';
import i18n from '@/plugins/i18n';

const { t } = i18n.global;

export const Menus: CustomRouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: {
      id: '1',
      title: t('menu.dashboard'),
      icon: 'mdi-view-dashboard',
    },
  },
  {
    path: '/user-management',
    name: 'user-management',
    meta: {
      id: '2',
      title: t('menu.userManagement'),
      icon: 'mdi-account-box',
    },
    children: [
      {
        path: '/user-list',
        name: 'user-list',
        component: () => import('@/pages/user-management/user-list/index.vue'),
        meta: {
          id: '3',
          title: t('menu.userList'),
          icon: 'mdi-card-account-details',
        },
      },
      {
        path: '/role-list',
        name: 'role-list',
        component: () => import('@/pages/user-management/role-list/index.vue'),
        meta: {
          id: '4',
          title: t('menu.roleList'),
          icon: 'mdi-list-box',
        },
      },
    ],
  },
];

const Layout: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layouts/basic-layout/Layout.vue'),
    redirect: '/dashboard',
    children: Menus as RouteRecordRaw[],
  },
];

export default Layout;
