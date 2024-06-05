/**
 * 系统分页接口
 */
declare interface Page {
  page: number;
  itemPrePage: number;
  sortBy?: [];
}

declare interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 上传文件路径，也是OSS或者本地路径分类
 */
declare type UploadPath = 'user-avatar' | 'user-background';
