// global.d.ts
import 'vuetify';

declare global {
  type BreadcrumbItem = string | InternalBreadcrumbItem;
}
