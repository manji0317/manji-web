<script setup lang="ts">
  import { CustomRouteRecordRaw } from 'vue-router';

  defineProps({
    item: {
      required: true,
      type: Object as () => CustomRouteRecordRaw,
    },
    level: {
      type: Number,
      default: 0,
    },
  });
</script>

<template>
  <v-list-group v-if="item.meta.sidebar">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" rounded>
        <!-- 图标  -->
        <template v-slot:prepend>
          <v-icon :icon="item.meta.icon" />
        </template>
        <!---菜单名字  -->
        <v-list-item-title v-text="$t(item.meta.title)" />
        <!-- 副标题 -->
        <v-list-item-subtitle v-if="item.meta.subCaption" >
          {{ item.meta.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>

    <template v-for="subitem in item.children" :key="subitem.meta.id">
      <NavCollapse v-if="subitem.children" :item="subitem" :level="level + 1" />
      <NavItem :item="subitem" v-else></NavItem>
    </template>
  </v-list-group>
</template>

<style scoped></style>
