<script lang="ts" setup>
  import { Menus } from '@/router/router-menu';
  import { computed } from 'vue';
  import { CustomRouteRecordRaw } from 'vue-router';
  import { flattenMenu } from '@/utils/MenuUtil';

  const emits = defineEmits(['update:modelValue']);

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
