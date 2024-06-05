<script lang="ts" setup>
  defineProps({
    avatar: String,
    size: { type: Number, default: 64 },
  });
</script>

<template>
  <v-avatar v-bind="$attrs" class="ma-1" :size="size" >
    <v-img v-if="!!avatar" :lazy-src="avatar" :src="avatar" :height="size" cover>
      <!-- 图片加载等待 -->
      <template #placeholder>
        <v-row align="center" justify="center" class="fill-height ma-0">
          <v-progress-circular color="grey-lighten-4" indeterminate />
        </v-row>
      </template>

      <!-- 图片加载失败 -->
      <template #error>
        <v-row align="center" justify="center" class="fill-height ma-0">
          <v-icon size="32" color="error"> mdi-alert-circle</v-icon>
        </v-row>
      </template>
    </v-img>
    <v-icon v-else color="grey" size="48" icon="mdi-account-circle" />
  </v-avatar>
</template>

<style scoped></style>
