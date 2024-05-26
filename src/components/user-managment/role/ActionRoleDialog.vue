<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import MenuSelectChip from '@/components/user-managment/MenuSelectChip.vue';
  import { getRoleById, roleAction } from '@/api/role.api';
  import { Message } from '@/plugins/vuetify-global';

  let { t } = useI18n();
  const stepperStep = ref<number>(1);
  const selectMenuIds = ref<string[]>([]);

  const emits = defineEmits(['update:modelValue', 'reload:dataList']);

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
            selectMenuIds.value = res.data.menus || [];
          }
        })
        .finally(() => (pageLoading.value = false));
    }
  });

  // 处理下一步
  const handleNext = handleSubmit((value: Role) => {
    stepperStep.value += 1;
  });

  // dialog关闭处理
  const handleClose = () => {
    // 将数据初始化
    resetForm();
    stepperStep.value = 1;
    id.value = '';
    roleName.value = '';
    description.value = '';
    selectMenuIds.value = [];
    emits('update:modelValue', false);
  };

  // 角色操作
  const handleActionRole = () => {
    actionLoading.value = true;
    roleAction({
      id: id.value,
      roleName: roleName.value,
      description: description.value,
      menus: selectMenuIds.value,
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
  <v-dialog persistent max-width="500">
    <v-card flat>
      <v-toolbar height="50">
        <v-toolbar-title>{{ $t('role.actionRoleTitle') }}</v-toolbar-title>
        <v-toolbar-items>
          <v-btn variant="text" icon="mdi-close" @click="handleClose" />
        </v-toolbar-items>
      </v-toolbar>
      <v-stepper v-model="stepperStep" :items="[$t('role.actionRoleTitle'), $t('role.editMenu')]" alt-labels non-linear>
        <template #[`item.1`]>
          <v-card flat>
            <v-card-text>
              <v-text-field :label="$t('role.name')" prepend-inner-icon="mdi-form-textbox" v-model="roleName" :error-messages="errors.roleName" />
              <v-textarea
                :label="$t('role.description')"
                clearable
                counter
                prepend-inner-icon="mdi-white-balance-incandescent"
                v-model="description"
                :error-messages="errors.description"
              />
            </v-card-text>
          </v-card>
        </template>

        <template #[`item.2`]>
          <v-card flat>
            <v-card-text>
              <menu-select-chip v-model="selectMenuIds" />
            </v-card-text>
            <v-card-actions>
              <v-btn :loading="actionLoading" block color="blue-darken-4" variant="elevated" @click="handleActionRole">
                {{ $t('common.saveText') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>

        <template #actions>
          <v-stepper-actions @click:next="handleNext" @click:prev="stepperStep--" />
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
