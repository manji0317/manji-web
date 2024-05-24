<script lang="ts" setup>
  defineProps({
    dialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    titlePreIcon: {
      type: String,
      default: '',
    },
    titleColor: {
      type: String,
      default: '',
    },
    onConfirm: {
      type: Function,
      default: () => {},
    },
    onConfirmText: {
      type: String,
      default: '',
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onCancelText: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 400,
    },
  });
</script>

<template>
  <v-dialog :model-value="dialog" persistent :max-width="width">
    <v-card>
      <v-toolbar :color="titleColor">
        <v-icon v-if="!!titlePreIcon" :icon="titlePreIcon" />
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>{{ content }}</v-card-text>

      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="onCancel" prepend-icon="mdi-cancel">
          {{ onCancelText || $t('common.cancelText') }}
        </v-btn>

        <v-btn @click="onConfirm" prepend-icon="mdi-hand-okay" color="warning">
          {{ onConfirmText || $t('common.confirmText') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
