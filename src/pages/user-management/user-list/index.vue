<script setup lang="ts">
  import { TableHeader } from '@/pages/user-management/user-list/index.data';
  import { ref } from 'vue';
  import { getUserList } from '@/api/user.api';
  import {useDate} from "vuetify";
  let {format} = useDate();
  // 用户列表加载标识
  const userTableLoading = ref(false);
  // 用户列表数据
  const userList = ref<SysUser[]>([]);
  // 查询用户列表
  const loadUserListData = (options: any) => {
    userTableLoading.value = true;
    getUserList()
      .then((res) => {
        userList.value = res.data || [];
      })
      .finally(() => (userTableLoading.value = false));
  };
</script>

<template>
  {{format(new Date(), 'fullDate')}}
  <v-data-table-server :headers="TableHeader" :items="userList" :items-length="100" :loading="userTableLoading" @update:options="loadUserListData">
    <template #[`item.avatar`]="{ item }">
      <m-avatar rounded="0" size="64" :avatar="item.avatar" />
    </template>

    <template #[`item.status`]="{ item }">
      {{ item.status }}
    </template>
    <template #[`item.createTime`]="{ item }">
      <p>{{ $d(new Date(), 'long') }}</p>
    </template>
  </v-data-table-server>
</template>

<style scoped></style>
