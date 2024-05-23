/**
 * 路由配置
 */
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { RouterWhite } from '@/router/router-white';
import { setBeforeEachGuard, setAfterEachGuard } from '@/router/router-guard';
import Layout from './router-menu';

const router: Router = createRouter({
  routes: [...RouterWhite, ...Layout],
  history: createWebHistory(),
});

// 路由前置拦截处理
setBeforeEachGuard(router);

// 路由后置拦截处理
setAfterEachGuard(router);

export default router;
