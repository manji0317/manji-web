<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import { getRoleById, roleAction } from '@/api/role.api';
  import { Message } from '@/plugins/vuetify-global';

  let { t } = useI18n();
  const emits = defineEmits(['update:modelValue', 'reload:dataList']);
  // 步骤
  const stepperStep = ref<number>(0);

  // 步骤对应的标题
  const stepTitle = ref<string[]>([t('role.actionRoleTitle'), t('role.configurePermissions')]);

  // 记录选中的权限数据
  const menuPermissions = ref<{ [key: string]: string[] }>({});

  const props = defineProps({
    roleId: String,
  });

  // 操作角色加载标识
  const actionLoading = ref<boolean>(false);
  // 初始化页面标识
  const pageLoading = ref<boolean>(false);

  // 表单校验
  const { handleSubmit, errors, defineField, resetForm } = useForm<Role>({
    validationSchema: object({
      roleName: string().required(t('fieldError.required', [t('role.name')])),
      description: string()
        .nullable()
        .max(50, t('fieldError.max', [t('role.description'), 50])),
    }),
  });

  let [id] = defineField('id');
  let [roleName] = defineField('roleName');
  let [description] = defineField('description');

  // 监听传递的roleId做相应的处理
  watchEffect(() => {
    if (props.roleId) {
      // 获取角色信息
      pageLoading.value = false;
      getRoleById(props.roleId)
        .then((res) => {
          if (res.status === 200) {
            id.value = res.data.id;
            roleName.value = res.data.roleName;
            description.value = res.data.description || '';
            menuPermissions.value = res.data.permissions || {};
          }
        })
        .finally(() => (pageLoading.value = false));
    }
  });

  // 处理下一步
  const handleNext = handleSubmit(() => {
    stepperStep.value += 1;
  });

  // dialog关闭处理
  const handleClose = () => {
    // 将数据初始化
    resetForm();
    stepperStep.value = 0;
    id.value = '';
    roleName.value = '';
    description.value = '';
    menuPermissions.value = {};
    emits('update:modelValue', false);
  };

  // 角色操作
  const handleActionRole = () => {
    actionLoading.value = true;

    roleAction({
      id: id.value,
      roleName: roleName.value,
      description: description.value,
      permissions: menuPermissions.value,
    })
      .then((res) => {
        if (res.status === 200) {
          Message.success(t('common.actionSuccess'));
          // 关闭弹窗
          handleClose();
          // 加载列表
          emits('reload:dataList');
        }
      })
      .finally(() => (actionLoading.value = false));
  };
</script>

<template>
  <v-dialog persistent width="auto" scrollable>
    <v-card flat>
      <v-toolbar>
        <template #prepend>
          <v-icon :icon="`mdi-numeric-${stepperStep + 1}-circle`" color="primary" />
        </template>
        <v-toolbar-title>
          <v-toolbar-title>
            {{ stepTitle[stepperStep] }}
          </v-toolbar-title>
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn variant="text" icon="mdi-close" @click="handleClose" />
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-window v-model="stepperStep">
          <!-- 编辑角色信息 -->
          <v-window-item :value="0" class="pa-5">
            <v-text-field :label="$t('role.name')" prepend-inner-icon="mdi-form-textbox" v-model="roleName" :error-messages="errors.roleName" />
            <v-textarea
              :label="$t('role.description')"
              clearable
              counter
              prepend-inner-icon="mdi-white-balance-incandescent"
              v-model="description"
              :error-messages="errors.description"
            />
          </v-window-item>

          <!-- 编辑权限信息 -->
          <v-window-item :value="1">
            <config-menu-permissions class="py-2 px-5" :menu-permissions="menuPermissions" />
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider />

      <template #actions>
        <v-btn :disabled="stepperStep === 0" @click="stepperStep -= 1">{{ $t('common.previous') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="stepperStep === 0" @click="handleNext">{{ $t('common.next') }}</v-btn>
        <v-btn v-else @click="handleActionRole" :loading="actionLoading" variant="flat" color="primary">
          {{ $t('common.saveText') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
