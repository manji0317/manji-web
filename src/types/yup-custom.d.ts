// yup-custom.d.ts
import { StringSchema } from 'yup';

declare module 'yup' {
  interface StringSchema {
    unique(message: string, fieldName: string, tableName: string): this;
  }
}
