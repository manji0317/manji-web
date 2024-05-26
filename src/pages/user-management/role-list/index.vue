<script setup lang="ts">
  import { TableHeader } from '@/pages/user-management/role-list/index.data';
  import { reactive, ref } from 'vue';
  import { getRoleList, removeRoleById } from '@/api/role.api';
  import ActionRoleDialog from '@/components/user-managment/role/ActionRoleDialog.vue';
  import { Confirm, Message } from '@/plugins/vuetify-global';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  // 角色列表加载标识
  const roleTableLoading = ref(false);
  const roleDialogVisible = ref(false);
  const currentRoleId = ref<string | undefined>('');
  // 查询条件
  const condition = reactive<Page>({
    page: 1,
    itemPrePage: 10,
    sortBy: [],
  });

  // 接收角色数据
  const rolePageData = ref<PageResult<Role>>({
    records: [],
    total: 0,
    current: 0,
    size: 0,
    pages: 0,
  });

  // 加载角色列表数据
  const loadRoleListData = () => {
    roleTableLoading.value = true;
    getRoleList(condition)
      .then((res) => {
        rolePageData.value = res.data;
      })
      .finally(() => {
        roleTableLoading.value = false;
      });
  };

  // 操作角色
  const handleActionRole = (roleId?: string) => {
    currentRoleId.value = roleId;
    roleDialogVisible.value = true;
  };

  // 删除角色
  const handleRemoveRole = (roleId: string, roleName: string) => {
    Confirm.show({
      title: t('common.actionConfirm'),
      content: t('role.deleteRoleConfirmContent', [roleName]),
      titleColor: 'warning',
      onConfirm() {
        roleTableLoading.value = true;
        removeRoleById(roleId)
          .then((res) => {
            if (res.status === 200) {
              Message.success(t('common.actionSuccess'));
              loadRoleListData();
            }
          })
          .finally(() => (roleTableLoading.value = false));
      },
    });
  };
</script>

<template>
  <!-- 操作角色弹窗  @update:model-value 是为了清空currentRoleId 如不清空不会出发组件内watchEffect-->
  <action-role-dialog
    v-model="roleDialogVisible"
    @update:model-value="() => (currentRoleId = '')"
    @reload:data-list="loadRoleListData"
    :role-id="currentRoleId"
  />

  <v-card class="ma-10">
    <v-card-actions>
      <v-btn prepend-icon="mdi-star-plus" color="primary" @click="handleActionRole('')">{{ $t('role.addRole') }}</v-btn>
    </v-card-actions>
    <!-- User 数据表格 -->
    <v-data-table-server
      :header-props="{ align: 'center' }"
      :row-props="{ align: 'center' }"
      :headers="TableHeader"
      :items="rolePageData.records"
      :items-length="rolePageData.total"
      :loading="roleTableLoading"
      show-current-page
      v-model:page="condition.page"
      v-model:items-per-page="condition.itemPrePage"
      v-model:sort-by="condition.sortBy"
      :multi-sort="true"
      @update:options="loadRoleListData"
    >
      <template #[`item.actions`]="{ item }">
        <v-btn icon="mdi-pencil" color="primary" variant="text" @click="handleActionRole(item.id)" />
        <v-btn icon="mdi-delete-alert" color="warning" variant="text" @click="handleRemoveRole(item.id, item.roleName)" />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped></style>
