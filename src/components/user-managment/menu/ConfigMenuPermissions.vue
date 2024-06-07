<script lang="ts" setup>
  import { Menus } from '@/router/router-menu';
  import { flattenMenu } from '@/utils/MenuUtil';
  import { computed, defineProps, toRefs } from 'vue';

  // 接收父组件传递的 menuPermissions prop
  const props = defineProps<{ menuPermissions: { [key: string]: string[] } }>();

  // 解构传递的 props
  const { menuPermissions } = toRefs(props);

  // 扁平化处理菜单
  const flattenMenus = computed(() => flattenMenu(Menus));

  const handleSelectMenu = (menuId: string) => {
    if (menuPermissions.value[menuId]) {
      delete menuPermissions.value[menuId];
    } else {
      menuPermissions.value[menuId] = [];
    }
  };
</script>

<template>
  <v-item-group>
    <v-container>
      <v-row dense>
        <v-col v-for="item in flattenMenus" :key="item.meta.id" cols="12" sm="6" md="4">
          <v-card>
            <v-toolbar :title="$t(item.meta.title)">
              <template #prepend>
                <v-icon>{{ item.meta.icon }}</v-icon>
              </template>
              <v-toolbar-items>
                <v-switch
                  hide-details
                  inset
                  color="success"
                  :model-value="!!menuPermissions[item.meta.id]"
                  @change="handleSelectMenu(item.meta.id)"
                />
              </v-toolbar-items>
            </v-toolbar>

            <v-card-text class="text-medium-emphasis">
              {{ !item.meta.description ? $t('common.noDescription') : $t(item.meta.description || '') }}
            </v-card-text>

            <v-divider v-if="!!item.meta.permissions" />

            <v-card-actions>
              <v-chip-group multiple column variant="elevated" v-model="menuPermissions[item.meta.id]" color="success" filter>
                <v-chip v-for="(permission, index) in item.meta.permissions" :key="index" :value="permission">
                  {{ $t(`permission.${permission}`) }}
                </v-chip>
              </v-chip-group>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<style scoped></style>
