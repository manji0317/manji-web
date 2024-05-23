<script setup lang="ts">
  import { useSystemStore } from '@/store/systemStore';

  const systemStore = useSystemStore();
</script>

<template>
  <v-app>
    <v-snackbar-queue v-bind="$attrs" v-model="systemStore.messageQueue" />
  </v-app>
</template>

<style scoped></style>
