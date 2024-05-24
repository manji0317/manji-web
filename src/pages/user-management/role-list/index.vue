<script setup lang="ts">
  import { TableHeader } from '@/pages/user-management/role-list/index.data';
  import { reactive, ref } from 'vue';
  import { getRoleList } from '@/api/role.api';
  import ActionRoleDialog from '@/components/user-managment/role/ActionRoleDialog.vue';

  // 角色列表加载标识
  const roleTableLoading = ref(false);
  const roleDialogVisible = ref(false);
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

  // 除了操作角色
  const handleActionRole = () => {
    roleDialogVisible.value = true;
  };
</script>

<template>
  <!-- 操作角色弹窗 -->
  <action-role-dialog v-model="roleDialogVisible" />

  <v-card class="ma-10">
    <template #text>
      <v-btn prepend-icon="mdi-star-plus" color="primary" @click="handleActionRole">{{ $t('role.addRole') }}</v-btn>
    </template>
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
        <v-btn icon="mdi-pencil" color="primary" variant="text" />
        <v-btn icon="mdi-delete-alert" color="warning" variant="text" />
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped></style>
