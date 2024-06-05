import httpApi from '@/plugins/axios';

const API = {
  FIELD_UNIQUE: '/common/fieldUnique',
};

/**
 * 校验表中字段是否唯一
 *
 * @param field 字段名
 * @param value 字段值
 * @param table 表名
 */
export const fieldUnique = (field: string, value: any, table: string) => {
  return httpApi.get(`${API.FIELD_UNIQUE}`);
};
