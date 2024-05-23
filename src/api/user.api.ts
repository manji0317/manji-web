import httpApi from '@/plugins/axios';

const API = {
  GET_USER_BASIC_INFO: '/user/get/',
  GET_USER_LIST: '/user/getUserList',
};

/**
 * 获取用户信息（菜单数据、基本信息）
 */
export const getUserInfo = (username: string) => {
  return httpApi.get<AuthUser>(`${API.GET_USER_BASIC_INFO}${username}`);
};

/**
 * 查询用户列表数据
 */
export const getUserList = () => {
  return httpApi.get<SysUser[]>(API.GET_USER_LIST);
};
