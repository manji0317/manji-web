import { CustomRouteRecordRaw } from 'vue-router';
import { Menus } from '@/router/router-menu';

/**
 * 根据ID数组过滤菜单项，包括递归处理子菜单项。
 * @param ids 需要查找的ID数组
 * @returns 符合条件的菜单项数组
 */
export const findMenuItemsByIds = (ids: string[]): CustomRouteRecordRaw[] => {
  // 2. 定义一个过滤函数，用于递归处理菜单项
  const filterItems = (menu: CustomRouteRecordRaw): CustomRouteRecordRaw | null => {
    // menu是Menus中的每一项菜单，判断当前菜单是否在ids中，如果不在返回null
    if (!ids.includes(menu.meta.id)) return null;

    // 如果在ids中，则创建一个新的对象，并递归处理子菜单项
    const filteredMenu: CustomRouteRecordRaw = { ...menu };

    // 如果有子菜单，则递归处理子菜单项
    if (menu.children) {
      // 递归处理子菜单项，并过滤掉null的项
      const filteredChildren = menu.children.map(filterItems).filter(Boolean) as CustomRouteRecordRaw[];

      // 如果子菜单项不为空，则将子菜单项赋值给filteredMenu
      if (filteredChildren.length) {
        filteredMenu.children = filteredChildren;
      } else {
        // 如果子菜单项为空，则删除children属性
        delete filteredMenu.children;
      }
    }

    // 返回处理后的菜单项
    return filteredMenu;
  };

  // 1. 先执行此处filterItems
  return Menus.map(filterItems).filter(Boolean) as CustomRouteRecordRaw[];
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
