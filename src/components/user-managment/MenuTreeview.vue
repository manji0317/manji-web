<script lang="ts" setup>
  import { Menus } from '@/router/router-menu';
  import { computed } from 'vue';
  import type { CustomRouteRecordRaw } from 'vue-router';

  const emits = defineEmits(['update:modelValue']);

  const processMenu = (menu: CustomRouteRecordRaw): any => {
    return {
      value: menu.meta.id,
      title: menu.meta.title,
      icon: menu.meta.icon,
      children: menu.children ? menu.children.map(processMenu) : undefined,
    };
  };

  const menuItems = computed(() => {
    return Menus.map(processMenu);
  });
</script>

<template>
  <v-treeview
    @update:selected="emits('update:modelValue', $event)"
    :items="menuItems"
    selectable
    :item-props="true"
    v-bind="$attrs"
    density="compact"
  >
    <template #prepend="{ item }">
      <v-icon :icon="item.icon" v-if="item.icon" />
    </template>
    <template #title="{ item }">
      {{ $t(item.title) }}
    </template>
  </v-treeview>
</template>

<style scoped></style>
