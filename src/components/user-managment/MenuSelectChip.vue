<script lang="ts" setup>
  import { Menus } from '@/router/router-menu';
  import { computed, ref } from 'vue';
  import { CustomRouteRecordRaw } from 'vue-router';

  const emits = defineEmits(['update:modelValue']);
  /**
   * 将多级菜单扁平化为单级菜单数组。
   * @param {CustomRouteRecordRaw[]} menus - 原始的多级菜单数组。
   * @returns {CustomRouteRecordRaw[]} 扁平化后的单级菜单数组。
   */
  const flattenMenu = (menus: CustomRouteRecordRaw[]): CustomRouteRecordRaw[] => {
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

  const menuList = computed<CustomRouteRecordRaw[]>(() => {
    return flattenMenu(Menus);
  });
</script>

<template>
  <v-chip-group multiple column @update:modelValue="emits('update:modelValue', $event)">
    <v-chip v-for="(item, index) in menuList" :key="index" :prepend-icon="item.meta.icon" :value="item.meta.id" filter color="success">
      {{ $t(item.meta.title) }}
    </v-chip>
  </v-chip-group>
</template>

<style scoped></style>
