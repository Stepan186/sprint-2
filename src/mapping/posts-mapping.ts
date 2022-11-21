import {
  PostDb,
  PostsInterface, PostsResponseInteface
} from "../utilities/interfaces/posts/posts-interface";
import { paginationType } from "../repositories/blogs/blogs-query-repository";

export function transfromPostsForResponse(posts: PostDb[], pagination: paginationType, totalCount: number): PostsResponseInteface {
  const postsMap: PostsInterface[] = posts.map((p) => {
    return {
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt
    };
  });

  return {
    pagesCount: Math.ceil(totalCount / pagination.pageSize),
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    totalCount: totalCount,
    items: postsMap
  }
}
