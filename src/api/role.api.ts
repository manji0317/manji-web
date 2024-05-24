import httpApi from '@/plugins/axios';

const API = {
  ROLE_ACTION: '/role/',
  GET_ROLE_LIST: '/role/getRoleList',
};

/**
 * 获取角色列表
 * @param condition 分页查询数据
 */
export const getRoleList = (condition: Page) => {
  return httpApi.get<PageResult<Role>>(API.GET_ROLE_LIST, {
    params: condition
  });
};
