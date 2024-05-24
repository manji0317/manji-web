declare interface Page {
  page: number,
  itemPrePage: number,
  sortBy?: [],
}

declare interface PageResult<T> {
  records: T[],
  total: number,
  size: number,
  current: number,
  pages: number,
}
