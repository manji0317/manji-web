<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import { useI18n } from 'vue-i18n';
  import { toTypedSchema } from '@vee-validate/yup';
  import { getMenusByRoleIds, getRoleList } from '@/api/role.api';
  import { Loading, Message } from '@/plugins/vuetify-global';

  const { t } = useI18n();
  const emits = defineEmits(['update:modelValue']);

  // 步骤控制
  const step = ref<number>(1);

  // 表单校验
  const { handleSubmit, defineField, errors, resetForm } = useForm<SysUser>({
    validationSchema: toTypedSchema(
      object({
        nickname: string().required(t('fieldError.required', [t('user.nickname')])),
        username: string().required(t('fieldError.required', [t('common.account')])),
        password: string().required(t('fieldError.required', [t('login.password')])),
        email: string()
          .required(t('fieldError.required', [t('common.email')]))
          .email(t('fieldError.emailValid')),
      })
    ),
    initialValues: {
      gender: 1,
      status: 1,
    },
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
  // 角色列表
  const roleList = ref<Role[]>([]);
  const selectRoleIds = ref<string[]>([]);
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
  const handleNext = handleSubmit(() => {
    step.value += 1;

    // 加载角色列表
    Loading.loading(t('role.loadingRoleList'));
    getRoleList()
      .then((res) => {
        if (res.status === 200) {
          roleList.value = res.data;
        }
      })
      .catch(() => {
        Message.error(t('role.queryRoleListFail'));
      })
      .finally(() => Loading.close());
  });

  // 根据角色查询角色下设置的菜单
  const handleLoadMenuByRoleId = () => {
    if (!selectRoleIds.value.length) {
      selectMenuIds.value = [];
      return;
    }

    // 根据角色ID集合查询菜单数据
    getMenusByRoleIds(selectRoleIds.value)
      .then((res) => {
        if (res.status === 200) {
          selectMenuIds.value = res.data;
        }
      })
      .catch(() => {
        Message.error(t('common.queryFail'));
      });
  };

  // dialog关闭处理
  const handleClose = () => {
    // 将数据初始化
    resetForm();
    step.value = 1;
    roleList.value = [];
    selectMenuIds.value = [];
    selectRoleIds.value = [];
    emits('update:modelValue', false);
  };
</script>

<template>
  <v-dialog persistent scrollable max-width="500px">
    <v-card>
      <v-toolbar height="50">
        <v-app-bar-nav-icon :icon="`mdi-numeric-${step}-circle`" readonly color="primary" />
        <v-toolbar-title>{{ step === 1 ? $t('user.userInfo') : $t('role.editMenu') }}</v-toolbar-title>
        <v-toolbar-items>
          <v-btn @click="handleClose">
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
              <v-radio-group inline :label="$t('user.gender')" v-model="gender">
                <v-radio :label="$t('user.man')" :value="1" color="primary" />
                <v-radio :label="$t('user.woman')" :value="2" color="red" />
              </v-radio-group>
              <v-text-field type="date" prepend-inner-icon="$calendar" :label="$t('user.birthday')" v-model="birthday" clearable />
              <v-text-field :label="$t('common.email')" v-model="email" :error-messages="errors.email" />
              <v-text-field :label="$t('common.phone')" v-model="phone" />
              <v-radio-group inline :label="$t('common.status')" v-model="status">
                <v-radio :label="$t('common.enable')" :value="1" color="primary" />
                <v-radio :label="$t('common.disable')" :value="2" color="red" />
              </v-radio-group>
            </v-form>
          </v-window-item>
          <v-window-item :value="2" class="position-relative">
            <!-- 角色集合 -->
            <v-card-text>
              <h2 class="text-h6 mb-2">{{ $t('user.roleSelect') }}</h2>
              <v-chip-group multiple column v-model="selectRoleIds" @update:model-value="handleLoadMenuByRoleId" mobile>
                <v-chip v-for="(item, index) in roleList" :key="index" color="success" filter :value="item.id" :text="item.roleName" />
              </v-chip-group>
            </v-card-text>
            <!-- 菜单集合 -->
            <v-card-text>
              <h2 class="text-h6 mb-2">{{ $t('user.menuSelect') }}</h2>

              <menu-select-chip v-model="selectMenuIds" />
            </v-card-text>
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
