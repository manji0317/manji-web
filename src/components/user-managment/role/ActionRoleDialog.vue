<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import MenuSelectChip from '@/components/user-managment/MenuSelectChip.vue';

  let { t } = useI18n();
  const stepperStep = ref<number>(1);
  const selectMenuIds = ref<string[]>([]);

  const emits = defineEmits(['update:modelValue']);

  defineProps({
    role: { type: Object as () => Role },
  });

  // 表单校验
  const { handleSubmit, errors, defineField, resetForm } = useForm<Role>({
    validationSchema: object({
      roleName: string().required(t('fieldError.required', [t('role.name')])),
      description: string().max(50, t('fieldError.max', [t('role.description'), 50])),
    }),
    initialValues: {
      roleName: '',
      description: '',
    },
  });

  let [roleName] = defineField('roleName');
  let [description] = defineField('description');

  // 处理下一步
  const handleNext = handleSubmit((value: Role) => {
    stepperStep.value += 1;
  });

  // dialog关闭处理
  const handleClose = () => {
    // 将数据初始化
    resetForm();
    stepperStep.value = 1;
    roleName.value = '';
    description.value = '';
    selectMenuIds.value = [];
    emits('update:modelValue', false);
  };
</script>

<template>
  <v-dialog persistent max-width="500">
    <v-card flat>
      <v-toolbar>
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
              <v-btn block color="blue-darken-4" variant="elevated">{{ $t('common.saveText') }}</v-btn>
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
