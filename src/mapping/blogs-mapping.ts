import { BlogDb } from "../utilities/interfaces/blogs/blog-interface";
import { paginationType } from "../repositories/blogs/blogs-query-repository";
import { BlogsResponseInterface } from "../utilities/interfaces/blogs/blogs-response-interface";

export function transformBlogsResponse (blogs: BlogDb[], pagination: paginationType, totalCount: number): BlogsResponseInterface {

  const mapBlogs=  blogs.map((v) => {
    return {
      id: v._id.toString(),
      name: v.name,
      websiteUrl: v.websiteUrl,
      createdAt: v.createdAt
    };
  });

  return {
    pagesCount: Math.ceil(totalCount / pagination.pageSize),
    page: pagination.pageNumber,
    pageSize: pagination.pageSize,
    totalCount: totalCount,
    items: mapBlogs
  }
}

