import { BlogDb, BlogInterface } from "../../utilities/interfaces/blogs/blog-interface";
import { blogsCollection, postsCollection } from "../../db";
import { transformBlogsResponse} from "../../mapping/blogs-mapping";
import { ObjectId } from "mongodb";
import {
  PostDb, PostsResponseInteface
} from "../../utilities/interfaces/posts/posts-interface";
import { BlogsResponseInterface } from "../../utilities/interfaces/blogs/blogs-response-interface";
import { transfromPostsForResponse } from "../../mapping/posts-mapping";

export type paginationType = {
  pageNumber: number,
  pageSize: number
}

export type orderByType = {
  sortBy: string,
  sortDirection: 'asc' | 'desc'
}

export type searchTermType = {
  searchLoginTerm: string | null
  searchEmailTerm: string | null
}

export const blogsQueryRepository = {
  async findBlogById (id: string): Promise<BlogInterface | null> {

    const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

    if (blog) {
      return {id: blog._id.toString(), name: blog.name, websiteUrl: blog.websiteUrl, createdAt: blog.createdAt}
    }
    return null
  },

  async findBlogs(pagination: paginationType, orderBy: orderByType, searchNameTerm: string | null): Promise<BlogsResponseInterface> {
    let query = {}
    if (searchNameTerm) {
      query = {name: {$regex: searchNameTerm, $options: 'i'}}
    }
    let blogs: BlogDb[] = await blogsCollection.find(query).skip(pagination.pageNumber * pagination.pageSize - pagination.pageSize)
      .limit(pagination.pageSize).sort({ [orderBy.sortBy]: orderBy.sortDirection }).toArray();
    const totalCount: number = await blogsCollection.countDocuments(query);
    return transformBlogsResponse(blogs, pagination, totalCount);


  },

  async findPostsForBlog (pagination: paginationType, blogId: string, orderBy: orderByType): Promise<PostsResponseInteface> {

    const posts: PostDb[] = await postsCollection.find({blogId: blogId}).skip(pagination.pageNumber * pagination.pageSize - pagination.pageSize)
      .limit(pagination.pageSize).sort({[orderBy.sortBy]: orderBy.sortDirection}).toArray()

    const totalCount = await postsCollection.countDocuments({blogId: blogId})

    return transfromPostsForResponse(posts, pagination, totalCount)
  }
}
