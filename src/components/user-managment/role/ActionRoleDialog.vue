<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import { getRoleById, roleAction } from '@/api/role.api';
  import { Message } from '@/plugins/vuetify-global';
  import MenuTreeview from '@/components/user-managment/MenuTreeview.vue';
  import { Menus } from '@/router/router-menu';
  import { flattenMenu } from '@/utils/MenuUtil';

  let { t } = useI18n();
  // 步骤
  const stepperStep = ref<number>(0);

  // 选中的菜单
  const selectMenuIds = ref<string[]>([]);

  // 权限数据
  const menuPermissions = ref<any[]>([]);

  // 根据选中的菜单生成可选权限信息
  const generatePermissions = () => {
    if (!selectMenuIds.value.length) {
      return;
    }

    // 将菜单数据做扁平化处理
    let menus = flattenMenu(Menus);

    menuPermissions.value = selectMenuIds.value
      .map((id) => {
        const menu = menus.find((menu) => menu.meta.id === id);
        if (menu && menu.meta.permissions) {
          return {
            icon: menu.meta.icon,
            title: menu.meta.title,
            permissions: menu.meta.permissions,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  };
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

  // 步骤对应的标题
  const stepTitle = ref<string[]>([t('role.actionRoleTitle'), t('role.configurePermissions')]);

  // 处理下一步
  const handleNext = handleSubmit(() => {
    stepperStep.value += 1;

    if (stepperStep.value === 1) {
      // 生成权限数据
      generatePermissions();
    }
  });

  // dialog关闭处理
  const handleClose = () => {
    // 将数据初始化
    resetForm();
    stepperStep.value = 0;
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
  <v-dialog persistent max-width="350" width="auto" scrollable>
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

      <v-card-text style="height: 450px">
        <v-window v-model="stepperStep">
          <v-window-item :value="0">
            <v-sheet width="500">
              <v-list-subheader>{{ $t('role.basicRoleInfo') }}</v-list-subheader>
              <v-text-field :label="$t('role.name')" prepend-inner-icon="mdi-form-textbox" v-model="roleName" :error-messages="errors.roleName" />
              <v-textarea
                :label="$t('role.description')"
                clearable
                counter
                prepend-inner-icon="mdi-white-balance-incandescent"
                v-model="description"
                :error-messages="errors.description"
              />
              <v-list-subheader>{{ $t('role.configMenu') }}</v-list-subheader>
              <menu-treeview v-model:selected="selectMenuIds" class="pa-0" />
            </v-sheet>
          </v-window-item>
          <v-window-item :value="1">
            <v-empty-state
              icon="mdi-select-remove"
              color="info"
              :title="$t('role.noMenuDataTitle')"
              :text="$t('role.noMenuDataText')"
              v-if="!selectMenuIds.length || !menuPermissions.length"
            />

            <v-sheet width="500" v-else>
              <v-list density="compact">
                <v-list-item v-for="(item, index) in menuPermissions" :key="index">
                  <v-list-item-subtitle>
                    <v-icon :icon="item.icon" v-if="item.icon" />
                    {{ $t(item.title) }}
                  </v-list-item-subtitle>
                  <v-chip-group multiple>
                    <v-chip
                      v-for="(permission, index) in item.permissions"
                      :key="index"
                      color="success"
                      filter
                      :value="permission"
                      :text="permission"
                    />
                  </v-chip-group>
                </v-list-item>
              </v-list>
            </v-sheet>
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
