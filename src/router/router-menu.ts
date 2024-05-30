import type { CustomRouteRecordRaw, RouteRecordRaw } from 'vue-router';

export const Menus: CustomRouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
    meta: {
      id: '1',
      title: 'menu.dashboard',
      icon: 'mdi-view-dashboard',
      sidebar: true
    },
  },
  {
    path: '/user-management',
    name: 'user-management',
    redirect: '/user-list',
    meta: {
      id: '2',
      title: 'menu.userManagement',
      icon: 'mdi-account-box',
      sidebar: true
    },
    children: [
      {
        path: '/user-info/:userId',
        name: 'user-info',
        component: () => import('@/pages/user-management/user-info/index.vue'),
        meta: {
          id: '5',
          title: 'menu.userInfo',
          icon: 'mdi-badge-account-outline',
          sidebar: false
        },
      },
      {
        path: '/user-list',
        name: 'user-list',
        component: () => import('@/pages/user-management/user-list/index.vue'),
        meta: {
          id: '3',
          title: 'menu.userList',
          icon: 'mdi-account-search-outline',
          sidebar: true
        },
      },
      {
        path: '/role-list',
        name: 'role-list',
        component: () => import('@/pages/user-management/role-list/index.vue'),
        meta: {
          id: '4',
          title: 'menu.roleList',
          icon: 'mdi-list-box',
          sidebar: true
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
