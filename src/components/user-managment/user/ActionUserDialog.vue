<script lang="ts" setup>
  import { onMounted, ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@/plugins/vuetify-global';
  import { useUserFormValidation } from '@/components/user-managment/user/user.form';
  import { actionUser, getUserInfo } from '@/api/user.api';
  import type { AxiosError } from 'axios';
  import { getRoleList } from '@/api/role.api';

  const { t } = useI18n();
  const emits = defineEmits(['update:modelValue', 'reload:user-list']);

  // 加载用户状态
  const loadingUserInfo = ref<boolean>(false);

  // 用户表单校验
  const { handleSubmit, defineField, errors, resetForm, setValues } = useUserFormValidation(
    {},
    {
      gender: 1,
      status: 1,
    }
  );

  const [id] = defineField('id');
  const [nickname] = defineField('nickname');
  const [username] = defineField('username');
  const [email] = defineField('email');
  const [gender] = defineField('gender');
  const [birthday] = defineField('birthday');
  const [phone] = defineField('phone');
  const [status] = defineField('status');
  const [roles] = defineField('roles');

  // 角色列表
  const roleList = ref<Role[]>([]);

  // 获取用户ID
  const props = defineProps({
    userId: String,
  });

  // 监听用户ID变化、获取用户详细信息
  watchEffect(() => {
    if (props.userId) {
      loadingUserInfo.value = true;
      // 根据用户ID查询用户详细信息
      getUserInfo(props.userId)
        .then((res) => {
          if (res.status === 200) {
            setValues(res.data);
          }
        })
        .catch(() => Message.error(t('common.queryFail')))
        .finally(() => (loadingUserInfo.value = false));
    }
  });

  // 保存或修改用户信息
  const handleSaveUserInfo = handleSubmit((values) => {
    loadingUserInfo.value = true;
    actionUser(id.value, values)
      .then((res) => {
        if (res.status === 200) {
          Message.success(t('common.actionSuccess'));
          handleClose();
          emits('reload:user-list');
        }
      })
      .catch((err: AxiosError) => {
        Message.error(t(`bizError.${err.response?.data}`));
      })
      .finally(() => (loadingUserInfo.value = false));
  });

  // dialog关闭处理
  const handleClose = () => {
    // 将数据初始化
    resetForm();
    emits('update:modelValue', false);
  };

  onMounted(() => {
    getRoleList().then(({ status, data }) => {
      if (status === 200) {
        roleList.value = data;
      }
    });
  });
</script>

<template>
  <v-dialog persistent scrollable max-width="500px">
    <v-card :loading="loadingUserInfo">
      <v-toolbar>
        <v-toolbar-title>
          {{ $t('user.userInfo') }}
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn @click="handleClose">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-text-field prepend-inner-icon="mdi-rename-box" :label="$t('user.nickname')" v-model="nickname" :error-messages="errors.nickname" />
          <v-text-field prepend-inner-icon="mdi-account" :label="$t('common.account')" v-model="username" :error-messages="errors.username" />
          <v-radio-group inline :label="$t('user.gender')" v-model="gender">
            <v-radio :label="$t('user.man')" :value="1" color="primary" />
            <v-radio :label="$t('user.woman')" :value="2" color="red" />
          </v-radio-group>
          <v-text-field type="date" prepend-inner-icon="$calendar" :label="$t('user.birthday')" v-model="birthday" clearable />
          <v-text-field prepend-inner-icon="mdi-email" :label="$t('common.email')" v-model="email" :error-messages="errors.email" />
          <v-text-field prepend-inner-icon="mdi-phone" :label="$t('common.phone')" v-model="phone" />
          <v-select clearable chips multiple item-value="id" item-title="roleName" :items="roleList" :label="$t('role.actionRoleTitle')" v-model="roles" />
          <v-radio-group inline :label="$t('common.status')" v-model="status">
            <v-radio :label="$t('common.enable')" :value="1" color="primary" />
            <v-radio :label="$t('common.disable')" :value="2" color="red" />
          </v-radio-group>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" variant="flat" @click="handleSaveUserInfo">
          {{ $t('common.saveText') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
