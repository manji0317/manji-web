import httpApi from '@/plugins/axios';

const API = {
  ROLE_ACTION: '/role',
  GET_ROLE_LIST: '/role/getRoleList',
};

/**
 * 获取角色列表
 * @param condition 分页查询数据
 */
export const getRoleList = (condition: Page) => {
  return httpApi.get<PageResult<Role>>(API.GET_ROLE_LIST, {
    params: condition,
  });
};

/**
 * 创建角色信息
 */
export const roleAction = (role: Required<Role>) => {
  if (role.id) {
    // id有值走更新
    return httpApi.patch(`${API.ROLE_ACTION}/${role.id}`, role);
  }
  return httpApi.post(API.ROLE_ACTION, role);
};

/**
 * 跟ID获取角色信息
 */
export const getRoleById = (roleId: string) => {
  return httpApi.get<Role>(`${API.ROLE_ACTION}/${roleId}`);
};

/**
 * 根据ID删除角色
 */
export const removeRoleById = (roleId: string) => {
  return httpApi.delete(`${API.ROLE_ACTION}/${roleId}`);
};
