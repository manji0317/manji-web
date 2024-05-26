<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const emits = defineEmits(['update:modelValue']);

  // 步骤控制
  const step = ref<number>(1);

  // 表单校验
  const { handleSubmit, defineField, errors } = useForm<SysUser>({
    validationSchema: object({
      nickname: string().required(t('fieldError.required', [t('user.nickname')])),
      username: string().required(t('fieldError.required', [t('common.account')])),
      password: string().required(t('fieldError.required', [t('login.password')])),
      email: string()
        .required(t('fieldError.required', [t('common.email')]))
        .email(t('fieldError.emailValid')),
    }),
  });

  const [nickname] = defineField('nickname');
  const [username] = defineField('username');
  const [password] = defineField('password');
  const [email] = defineField('email');
  const [gender] = defineField('gender');
  const [birthday] = defineField('birthday');
  const [phone] = defineField('phone');
  const [status] = defineField('status');

  // 选择的菜单集合
  const selectMenuIds = ref<string[]>([]);
  const props = defineProps({
    userId: String,
  });

  watchEffect(() => {
    if (props.userId) {
      // 根据用户ID查询用户详细信息
    }
  });

  // 保存或修改用户信息
  const handleSaveUserInfo = () => {};

  // 点击Next处理
  const handleNext = handleSubmit((values: SysUser) => {
    step.value += 1;
  });
</script>

<template>
  <v-dialog persistent scrollable max-width="500px">
    <v-card>
      <v-toolbar height="50">
        <v-app-bar-nav-icon :icon="`mdi-numeric-${step}-circle`" readonly color="primary" />
        <v-toolbar-title>{{ step === 1 ? $t('user.userInfo') : $t('role.editMenu') }}</v-toolbar-title>
        <v-toolbar-items>
          <v-btn @click="emits('update:modelValue')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-form>
              <v-text-field :label="$t('user.nickname')" v-model="nickname" :error-messages="errors.nickname" />
              <v-text-field :label="$t('common.account')" v-model="username" :error-messages="errors.username" />
              <v-text-field :label="$t('login.password')" v-model="password" :error-messages="errors.password" />
              <v-text-field :label="$t('user.gender')" v-model="gender" />
              <v-text-field :label="$t('user.birthday')" v-model="birthday" type="date" />
              <v-text-field :label="$t('common.email')" v-model="email" :error-messages="errors.email" />
              <v-text-field :label="$t('common.phone')" v-model="phone" />
              <v-text-field :label="$t('common.status')" v-model="status" />
            </v-form>
          </v-window-item>
          <v-window-item :value="2">
            <!-- 角色集合 -->

            <!-- 菜单集合 -->
            <menu-select-chip v-model="selectMenuIds" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="step > 1" variant="text" @click="step--"> {{ $t('common.previous') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step < 2" color="primary" variant="flat" @click="handleNext"> {{ $t('common.next') }}</v-btn>
        <v-btn v-if="step === 2" color="primary" variant="flat" @click="handleSaveUserInfo"> {{ $t('common.saveText') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
