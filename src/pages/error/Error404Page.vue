<template>
  <v-row no-gutters class="h-screen">
    <v-col class="d-flex align-center justify-center">
      <div class="text-center">
        <img src="@/assets/error/404.svg" alt="grid" class="w-100" />
        <div class="text-h3 font-weight-bold ma-2">{{ $t('common.error404Title') }}</div>
        <p>
          <small class="text-h5 text-medium-emphasis" v-html="$t('common.error404Description')" />
        </p>
        <v-btn variant="flat" color="primary" class="mt-4" to="/" prepend-icon="mdi-home">{{ $t('common.backHome') }}</v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts"></script>
