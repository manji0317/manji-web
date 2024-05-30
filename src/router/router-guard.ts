/**
 * 路由守卫配置文件。
 *
 * @author 白青东
 * @since 2024年4月26日 14点26分
 */

import { getAccessToken, getRefreshToken, setAccessToken, verifyToken } from '@/utils/TokenUtil';
import { type Router } from 'vue-router';
import { getWhitePaths } from './router-white';
import { refreshToken } from '@/api/auth.api';

/**
 * 前置路由守卫
 */
export const setBeforeEachGuard = (router: Router) => {
  router.beforeEach(async (to, _from, next) => {
    const { path } = to;

    // 判断路由是否为白名单，白名单直接放行
    if (getWhitePaths().includes(path)) {
      return next();
    }

    // 获取accessToken
    const accessToken = getAccessToken();

    // 判断accessToken是否有效
    if (verifyToken(accessToken)) {
      return next();
    }

    try {
      if (getRefreshToken()) {
        // 尝试刷新Token
        const res = await refreshToken();
        setAccessToken(res.data.accessToken);
        next();
      } else {
        // 如果立案刷新token都没有则直接跳转到登录页面
        next({
          path: '/login',
        });
      }
    } catch (error) {
      // 刷新Token失败，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  });
};

/**
 * 后置路由守卫
 */
export const setAfterEachGuard = (router: Router) => {
  router.afterEach((to, from, failure) => {
    console.log('路由守卫', to, from, failure);
  });
};
