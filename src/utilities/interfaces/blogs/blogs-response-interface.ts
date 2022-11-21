import { BlogInterface } from "./blog-interface";

export interface BlogsResponseInterface {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogInterface[]
}
