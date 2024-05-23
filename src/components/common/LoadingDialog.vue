<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  defineProps({
    dialog: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: () => {
        const { t } = useI18n();
        return t('common.loadingText')
      },
    },
  });
</script>

<template>
  <v-dialog :model-value="dialog" persistent max-width="320">
    <v-list elevation="12" rounded="lg">
      <v-list-item>
        <template v-slot:title>
          {{ loadingText }}
        </template>
        <template v-slot:prepend>
          <div class="pe-4">
            <v-progress-circular color="primary" indeterminate="disable-shrink" size="24" width="3" />
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<style scoped></style>
