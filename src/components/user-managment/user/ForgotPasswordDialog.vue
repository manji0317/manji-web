<script lang="ts" setup>
  import { ref as VueRef } from 'vue';
  import { useDisplay } from 'vuetify';
  import { useI18n } from 'vue-i18n';
  import { useForm } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/yup';
  import { object, string, ref } from 'yup';
  import { Password } from '@/components/user-managment/user/user.form';
  import { updateUserPassword } from '@/api/user.api';
  import { Message } from '@/plugins/vuetify-global';
  import { type AxiosError } from 'axios';

  const { mobile } = useDisplay();
  const { t } = useI18n();

  let emits = defineEmits(['update:modelValue']);
  // 密码修改中标识
  const loadingPassword = VueRef<boolean>(false);

  const props = defineProps({
    userId: {
      required: true,
      type: String,
    },
  });

  const { errors, handleSubmit, defineField, resetForm } = useForm<Password>({
    validationSchema: toTypedSchema(
      object({
        password: string().required(t('fieldError.required', [t('login.password')])),
        newPassword: string()
          .required(t('fieldError.required', [t('login.newPassword')]))
          .min(6, t('fieldError.min', [t('login.newPassword'), 6])),
        confirmPassword: string()
          .required(t('fieldError.required', [t('login.confirmPassword')]))
          .oneOf([ref('newPassword')], t('login.confirmPasswordError')),
      })
    ),
  });

  const [password] = defineField('password');
  const [newPassword] = defineField('newPassword');
  const [confirmPassword] = defineField('confirmPassword');

  // 重置密码提交
  const handleResetPassword = handleSubmit((values) => {
    loadingPassword.value = true;
    updateUserPassword(props.userId, values)
      .then((res) => {
        res.status === 200 && Message.success(t('user.passwordModifiedSuccessfully'));
      })
      .catch((err: AxiosError) => {
        Message.error(t(`bizError.${err.response?.data}`));
      })
      .finally(() => (loadingPassword.value = false));
  });
</script>

<template>
  <v-dialog v-bind="$attrs" width="500" scrollable persistent>
    <v-card :loading="loadingPassword">
      <v-toolbar>
        <v-toolbar-title>
          {{ $t('login.resetYourPassword') }}
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            @click="
              resetForm();
              emits('update:modelValue');
            "
          />
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-text-field v-model="password" :label="$t('login.password')" :error-messages="errors.password" />
        <v-text-field v-model="newPassword" :label="$t('login.newPassword')" :error-messages="errors.newPassword" />
        <v-text-field v-model="confirmPassword" :label="$t('login.confirmPassword')" :error-messages="errors.confirmPassword" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn :block="mobile" color="primary" variant="flat" @click="handleResetPassword" :loading="loadingPassword">
          {{ $t('common.resetText') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
