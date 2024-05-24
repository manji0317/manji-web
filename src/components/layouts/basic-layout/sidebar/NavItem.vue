<script setup lang="ts">
  import { CustomRouteRecordRaw } from 'vue-router';

  defineProps({
    item: {
      required: true,
      type: Object as () => CustomRouteRecordRaw,
    },
  });
</script>

<template>
  <v-list-item :to="item.path">
    <template v-slot:prepend>
      <v-icon :icon="item.meta.icon" />
    </template>
    <template v-slot:append>
      <!-- 预留红点 -->
    </template>
    <v-list-item-title v-text="$t(item.meta.title)" />
  </v-list-item>
</template>

<style scoped></style>
