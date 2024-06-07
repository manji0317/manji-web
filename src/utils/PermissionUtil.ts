/**
 * 前端鉴权工具类
 *
 * @author: 白青东
 * @date: 2024-06-07
 */
import { useAuthStore } from '@/store/authStore';
import pinia from '@/plugins/pinia';

const authStore = useAuthStore(pinia);

/**
 * 检查权限
 * @param permission 权限标识
 * @param menuId 菜单ID
 */
const checkPermission = (permission: string, menuId: string): boolean => {
  // 输入参数验证
  if (!permission.trim()) {
    console.error('Invalid permission:', permission);
    return false;
  }
  if (!menuId.trim()) {
    console.error('Invalid menuId:', menuId);
    return false;
  }

  // 检查权限
  const permissions = authStore?.permissions?.[menuId] ?? [];
  return permissions.includes(permission);
};

export default checkPermission;
