import { type FormContext, useForm } from 'vee-validate';
import { object, string, type ObjectShape } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';
import i18n from '@/plugins/i18n';

const t = i18n.global.t;

/**
 * 针对用户信息，以及用户列表新增用户表单的表单校验，因为两者校验规则一致，所以封装一个方法·
 * @param schema 拓展需要校验的字段
 * @param initialValues 初始化表单值
 */
export const useUserFormValidation = (schema?: ObjectShape, initialValues?: Partial<SysUser>): FormContext<SysUser, SysUser> => {
  return useForm<SysUser>({
    validationSchema: toTypedSchema(
      object({
        nickname: string().required(t('fieldError.required', [t('user.nickname')])),
        username: string().required(t('fieldError.required', [t('common.account')])),
        email: string()
          .required(t('fieldError.required', [t('common.email')]))
          .email(t('fieldError.emailValid')),
        ...schema,
      })
    ),
    initialValues: {
      id: '',
      ...initialValues, // 合并初始值
    },
  });
};

/**
 * 密码修改表单
 */
export interface Password {
  password: string;
  newPassword: string;
  confirmPassword: string;
}
