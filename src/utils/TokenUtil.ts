export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
import { jwtDecode } from 'jwt-decode';

// 获取Token
export const getAccessToken = (): string => {
  return localStorage.getItem(ACCESS_TOKEN) || '';
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN);
};

// 设置Token
export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN, token);
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN, token);
};

// 删除Token
export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

// 验证Token是否有效
export const verifyToken = (token: string): boolean => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < exp;
  } catch (error) {
    return false;
  }
};

// 解析Token获取用户UserId
export const getUserIdFromToken = (): string => {
  let accessToken = getAccessToken();

  if (!accessToken) return '';
  try {
    const { sub = '' } = jwtDecode(accessToken);
    return sub;
  } catch (error) {
    return '';
  }
};
