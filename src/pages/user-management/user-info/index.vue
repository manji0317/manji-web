<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { onMounted, ref } from 'vue';
  import { getUserInfo, actionUser, updateUserImg } from '@/api/user.api';
  import { Loading, Message } from '@/plugins/vuetify-global';
  import { useI18n } from 'vue-i18n';
  import { useUserFormValidation } from '@/components/user-managment/user/user.form';
  import defaultBackground from '@/assets/user/default-user-background.png';

  const router = useRouter();
  const { t } = useI18n();

  // 上传文件Input通过click方法触发唤醒选择文件窗口
  const fileRef = ref<HTMLInputElement>();
  // 当前选中的上传文件的类型，头像或者背景
  const uploadPath = ref<UploadPath>();
  // 当前选中的文件
  const file = ref<File>();

  // 忘记密码弹窗
  const forgotPasswordDialogVisible = ref<boolean>(false);
  // 用户信息表单校验
  const { setValues, defineField, handleSubmit, errors } = useUserFormValidation();

  const [id] = defineField('id');
  const [nickname] = defineField('nickname');
  const [email] = defineField('email');
  const [gender] = defineField('gender');
  const [birthday] = defineField('birthday');
  const [phone] = defineField('phone');
  const [status] = defineField('status');
  const [backgroundImg] = defineField('backgroundImg');
  const [avatar] = defineField('avatar');

  // 保存或修改用户信息
  const handleActionUser = handleSubmit((values) => {
    Loading.loading(t('common.updateLoading'));
    actionUser(id.value, values)
      .then((res) => {
        res.status === 200 && Message.success(t('common.actionSuccess'));

        setUserInfo(values.id);
      })
      .catch(() => Message.error(t('user.updateUserInfoFailed')))
      .finally(() => Loading.close());
  });

  // 加载用户信息
  const setUserInfo = (userId: string) => {
    Loading.loading(t('common.loadingText'));
    getUserInfo(userId)
      .then((res) => {
        setValues(res.data, true);
      })
      .catch(() => {
        Message.error(t('user.getUserInfoFailed'));
      })
      .finally(() => Loading.close());
  };

  // 唤起选择文件
  const handleSelectFile = (type: UploadPath) => {
    fileRef.value?.click();
    uploadPath.value = type;
  };

  // 上传文件
  const handleUploadFile = () => {
    // 限制文件大小不能超过3M
    if (file instanceof File && file.size > 3 * 1024 * 1024) {
      Message.warning(t('common.uploadFileSizeLimit', ['3MB']));
      return;
    }
    Loading.loading(t('common.uploadLoading'));
    updateUserImg(id.value, {
      uploadType: uploadPath.value,
      file: file.value,
    })
      .then((res) => {
        if (res.status === 200) {
          Message.success(t('common.uploadSuccess'));
          setUserInfo(id.value);
        }
      })
      .catch(() => Message.error(t('common.uploadFailed')))
      .finally(() => {
        Loading.close();
        file.value = undefined;
      });
  };

  onMounted(() => {
    // 根据路由参数获取用户信息
    const { userId } = router.currentRoute.value.params;
    setUserInfo(userId as string);
  });
</script>

<template>
  <!-- 忘记密码弹窗 -->
  <forgot-password-dialog v-model="forgotPasswordDialogVisible" :user-id="id" />
  <v-file-input v-model="file" hide-input accept=".png,.jpg,.jepg" prepend-icon="" ref="fileRef" @update:model-value="handleUploadFile" />

  <v-card>
    <!-- 用户背景图、上传背景图 Start -->
    <v-img class="align-end text-white" height="200" :src="!!backgroundImg ? backgroundImg : defaultBackground" cover>
      <v-card-title class="d-flex justify-space-between">
        {{ nickname }}
        <v-btn variant="outlined" density="comfortable" @click="handleSelectFile('user-background')">
          {{ $t('user.modifyBackgroundImage') }}
        </v-btn>
      </v-card-title>
    </v-img>
    <!-- 用户背景图、上传背景图 End -->

    <!-- 用户信息展示 Start -->
    <v-card-text>
      <!-- 用户头像展示区域 Start -->
      <v-row align="center" justify="center" class="mb-10">
        <m-avatar
          :avatar="avatar"
          class="border-lg border-primary position-absolute elevation-5 cursor-pointer"
          :size="80"
          @click="handleSelectFile('user-avatar')"
        />
      </v-row>
      <!-- 用户头像展示区域 End -->

      <v-row>
        <v-col cols="12" lg="4">
          <v-text-field v-model="nickname" :label="$t('user.nickname')" :error-messages="errors.nickname" />
        </v-col>

        <v-col cols="12" lg="4">
          <v-radio-group inline :label="$t('user.gender')" v-model="gender">
            <v-radio :label="$t('user.man')" :value="1" color="primary" />
            <v-radio :label="$t('user.woman')" :value="2" color="red" />
          </v-radio-group>
        </v-col>

        <v-col cols="12" lg="4">
          <v-text-field type="date" v-model="birthday" :label="$t('user.birthday')" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" lg="4">
          <v-text-field v-model="email" :label="$t('common.email')" :error-messages="errors.email" />
        </v-col>

        <v-col cols="12" lg="4">
          <v-text-field v-model="phone" :label="$t('common.phone')" />
        </v-col>

        <v-col cols="12" lg="4">
          <v-radio-group inline :label="$t('common.status')" v-model="status">
            <v-radio :label="$t('common.enable')" :value="1" color="primary" />
            <v-radio :label="$t('common.disable')" :value="2" color="red" />
          </v-radio-group>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- 用户信息展示 End -->

    <v-divider></v-divider>

    <!-- 操作区域 Start -->
    <v-card-actions>
      <!-- 保存用户信息 -->
      <v-btn color="primary" variant="flat" @click="handleActionUser">
        {{ $t('common.saveText') }}
      </v-btn>
      <v-spacer />
      <!-- 忘记密码 -->
      <v-btn color="warning" variant="flat" @click.stop="forgotPasswordDialogVisible = true">
        {{ $t('login.forgotPassword') }}
      </v-btn>
    </v-card-actions>
    <!-- 操作区域 End -->
  </v-card>
</template>

<style scoped></style>
