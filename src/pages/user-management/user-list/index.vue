<script setup lang="ts">
import {TableHeader, UserListCondition} from '@/pages/user-management/user-list/index.data';
import {reactive, ref} from 'vue';
import {deleteUserById, getUserList, updateUserById} from '@/api/user.api';
import {Confirm, Loading, Message} from '@/plugins/vuetify-global';
import {useI18n} from 'vue-i18n';
import {useDebounceFn} from '@vueuse/core';

const {t} = useI18n();
const condition = reactive<UserListCondition>({
  search: '',
  page: 1,
  itemPrePage: 10,
  sortBy: [],
});
// 用户列表加载标识
const userTableLoading = ref(false);
// 用户列表数据
const userPageData = ref<PageResult<SysUser>>({
  records: [],
  total: 0,
  current: 0,
  size: 0,
  pages: 0,
});
// 查询用户列表
const loadUserListData = () => {
  userTableLoading.value = true;
  getUserList(condition)
    .then((res) => {
      userPageData.value = res.data;
    })
    .finally(() => (userTableLoading.value = false));
};
// 删除用户
const handleRemoveUser = (userId: number, nickName: string) => {
  // TODO 此处需要添加判断所删除用户是否为当前登录用户，如果是需要给予提示询问。

  Confirm.show({
    title: t('common.actionConfirm'),
    content: t('user.userDeleteConfirm', [nickName]),
    titleColor: 'warning',
    onConfirm: () => {
      Loading.loading(t('common.deleteLoading'));
      deleteUserById(userId)
        .then((res) => {
          if (res.status === 200) {
            Message.success(t('common.actionSuccess'));
            loadUserListData();
          }
        })
        .finally(() => {
          Loading.close();
        });
    },
  });
};

// 监听查询条件变化
const handleSearch = useDebounceFn(() => {
  loadUserListData();
}, 1000);

// 更新用户状态
const handleUpdateUserStatus = (userId: number, status: number) => {
  Loading.loading(t('common.updateLoading'));
  updateUserById(userId, {status: status === 1 ? 2 : 1})
    .then((res) => {
      res.status === 200 && Message.success(t('common.actionSuccess'));
    })
    .finally(() => {
      Loading.close();
    });
};
</script>

<template>
  <!-- 用户权限弹窗 -->

  <v-card class="ma-10">
    <!-- 表格操作区域 -->
    <template v-slot:text>
      <v-text-field
        v-model="condition.search"
        clearable
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        @input="handleSearch"
      ></v-text-field>
    </template>

    <!-- User 数据表格 -->
    <v-data-table-server
      :header-props="{ align: 'center' }"
      :mobile="$vuetify.display.mobile"
      :headers="TableHeader"
      :items="userPageData.records"
      :items-length="userPageData.total"
      :loading="userTableLoading"
      show-current-page
      v-model:page="condition.page"
      v-model:items-per-page="condition.itemPrePage"
      v-model:sort-by="condition.sortBy"
      :multi-sort="true"
      @update:options="loadUserListData"
    >
      <template #[`item.avatar`]="{ item }">
        <m-avatar rounded="0" size="64" :avatar="item.avatar"/>
      </template>
      <template #[`item.status`]="{ item }">
        {{ item.status }}
      </template>
      <template #[`item.createTime`]="{ item }">
        <p>{{ $d(new Date(item.createTime), 'long') }}</p>
      </template>
      <template #[`item.gender`]="{ item }">
        <v-chip prepend-icon="mdi-face-man" color="green" v-if="item.gender === 1">
          <span>{{ $t('user.man') }}</span>
        </v-chip>
        <v-chip prepend-icon="mdi-face-woman" color="red" v-else-if="item.gender === 2">
          <span>{{ $t('user.woman') }}</span>
        </v-chip>
      </template>
      <template #[`item.email`]="{ item }">
        <a class="v-chip" :href="`mailto:${item.email}`" v-if="!!item.email">{{ item.email }}</a>
      </template>
      <template #[`item.phone`]="{ item }">
        <a class="v-chip v-btn" :href="`tel:${item.phone}`" v-if="!!item.phone">{{ item.phone }}</a>
      </template>
      <template #[`item.status`]="{ item }">
        <v-switch :model-value="item.status === 1" color="success" hide-details inset :class="{'d-flex justify-end': $vuetify.display.mobile}"
                  @click="handleUpdateUserStatus(item.id, item.status)"/>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn icon="mdi-account-edit" color="primary" variant="text"/>
        <v-btn icon="mdi-account-remove" color="warning" variant="text"
               @click="handleRemoveUser(item.id, item.nickname)"/>
        <v-btn icon="mdi-account-key" color="success" variant="text"/>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped></style>
