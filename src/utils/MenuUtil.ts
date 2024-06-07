import { CustomRouteRecordRaw } from 'vue-router';
import { Menus } from '@/router/router-menu';

/**
 * 根据ID数组过滤菜单项，包括递归处理子菜单项。
 * @param ids 需要查找的ID数组
 * @returns 符合条件的菜单项数组
 */
export const findMenuItemsByIds = (ids: string[]): CustomRouteRecordRaw[] => {
  // 2. 定义一个过滤函数，用于递归处理菜单项
  const filterItems = (menu: CustomRouteRecordRaw, path: CustomRouteRecordRaw[] = []): CustomRouteRecordRaw | null => {
    // path是当前菜单的路径栈，用于追踪父菜单
    const currentPath = [...path, menu];

    // 如果在ids中，或者任何子菜单在ids中，则返回true
    const isSelected = ids.includes(menu.meta.id);

    // 如果有子菜单，则递归处理子菜单项
    let filteredChildren: CustomRouteRecordRaw[] = [];
    if (menu.children) {
      filteredChildren = menu.children.map(child => filterItems(child, currentPath)).filter(Boolean) as CustomRouteRecordRaw[];
    }

    // 如果当前菜单被选中，或者有子菜单被选中
    if (isSelected || filteredChildren.length) {
      // 创建一个新的对象
      const filteredMenu: CustomRouteRecordRaw = { ...menu };
      if (filteredChildren.length) {
        filteredMenu.children = filteredChildren;
      } else {
        delete filteredMenu.children;
      }
      return filteredMenu;
    }

    return null;
  };

  // 1. 先执行此处filterItems
  return Menus.map(menu => filterItems(menu)).filter(Boolean) as CustomRouteRecordRaw[];
};

/**
 * 将多级菜单扁平化为单级菜单数组。
 * @param {CustomRouteRecordRaw[]} menus - 原始的多级菜单数组。
 * @returns {CustomRouteRecordRaw[]} 扁平化后的单级菜单数组。
 */
export const flattenMenu = (menus: CustomRouteRecordRaw[]): CustomRouteRecordRaw[] => {
  // 扁平化后的新菜单数组
  const flatMenu: CustomRouteRecordRaw[] = [];
  /**
   * 递归扁平化菜单数组。
   * @param {CustomRouteRecordRaw[]} items - 当前需要扁平化的菜单项数组。
   */
  const flatten = (items: CustomRouteRecordRaw[]) => {
    items.forEach((item) => {
      // 如果没有子菜单，则直接添加到扁平化菜单数组中
      if (!item.children) {
        flatMenu.push(item);
      } else {
        // 如果有子菜单，则递归扁平化子菜单
        flatten(item.children);
      }
    });
  };
  // 开始扁平化过程
  flatten(menus);
  return flatMenu;
};

/**
 * 判断当前用户跳转的路由是否有权限
 */
export const checkRoutePermission = (menuIds: string[], currentMenuID: string): boolean => {
  if (!menuIds.length) {
    return false;
  }
  return menuIds.includes(currentMenuID);
};
