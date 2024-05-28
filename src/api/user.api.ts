import httpApi from '@/plugins/axios';
import { UserListCondition } from '@/pages/user-management/user-list/index.data';

const API = {
  USER_ACTION: '/user/',
  GET_USER_LIST: '/user/getUserList',
};

/**
 * 获取用户信息（菜单数据、基本信息）
 */
export const getUserInfo = (username: string) => {
  return httpApi.get<AuthUser>(`${API.USER_ACTION}${username}`);
};

/**
 * 查询用户列表数据
 */
export const getUserList = (condition: UserListCondition) => {
  return httpApi.get<PageResult<SysUser>>(API.GET_USER_LIST, {
    params: condition,
  });
};

/**
 * 根据用户ID删除用户
 */
export const deleteUserById = (userId: string) => {
  return httpApi.delete(`${API.USER_ACTION}${userId}`);
};

/**
 * 根据用户ID更新用户
 */
export const updateUserById = (userId: string, data: Partial<SysUser>) => {
  return httpApi.patch(`${API.USER_ACTION}${userId}`, data);
};
