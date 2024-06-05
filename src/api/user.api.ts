import httpApi from '@/plugins/axios';
import { UserListCondition } from '@/pages/user-management/user-list/index.data';
import { Password } from '@/components/user-managment/user/user.form';

const API = {
  USER_ACTION: '/user/',
  GET_USER_LIST: '/user/getUserList',
  USER_UPDATE_PASSWORD: '/user/updatePassword/',

  UPDATE_USER_IMG: '/file/updateUserImg/',
};

/**
 * 获取用户信息（菜单数据、基本信息）
 */
export const getUserInfo = (userId: string) => {
  return httpApi.get<AuthUser>(`${API.USER_ACTION}${userId}`);
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
export const actionUser = (userId: string, data: Partial<AuthUser>) => {
  if (!userId) return httpApi.post(`${API.USER_ACTION}${userId}`, data);
  return httpApi.patch(`${API.USER_ACTION}${userId}`, data);
};

/**
 * 用户修改密码
 */
export const updateUserPassword = (userId: string, data: Password) => {
  return httpApi.patch(`${API.USER_UPDATE_PASSWORD}${userId}`, data);
};

/**
 * 修改用户头像、背景图片
 */
export const updateUserImg = (userId: string, data: Partial<UserImg>) => {
  return httpApi.patch(`${API.UPDATE_USER_IMG}${userId}`, data, {
    responseType: 'formdata',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
