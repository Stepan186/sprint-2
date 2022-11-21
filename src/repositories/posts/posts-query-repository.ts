import { postsCollection } from "../../db";
import { ObjectId } from "mongodb";
import {
  PostDbInterface,
  PostsInterface, PostsResponseInteface
} from "../../utilities/interfaces/posts/posts-interface";
import { orderByType, paginationType } from "../blogs/blogs-query-repository";
import { transfromPostsForResponse } from "../../mapping/posts-mapping";

export const postsQueryRepository = {
  async findPosts(pagination: paginationType, orderBy: orderByType): Promise<PostsResponseInteface> {
    const posts = await postsCollection.find().skip(pagination.pageNumber * pagination.pageSize - pagination.pageSize)
      .limit(pagination.pageSize).sort({ [orderBy.sortBy]: orderBy.sortDirection }).toArray();
    const totalCount = await postsCollection.countDocuments()
    return transfromPostsForResponse(posts, pagination, totalCount)
  },


  async findPostById(id: string): Promise<PostsInterface|null> {
    const post: PostDbInterface | null = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (post) {
      return {
        id: id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
      };
    } else {
      return null
    }
  },


}
