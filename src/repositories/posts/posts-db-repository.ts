import { postsCollection } from "../../db";
import { blogsQueryRepository } from "../blogs/blogs-query-repository";
import { BlogInterface } from "../../utilities/interfaces/blogs/blog-interface";
import {
  CreatePostForBlogInterface, CreatePostInterface,
  PostDbInterface,
  PostsInterface
} from "../../utilities/interfaces/posts/posts-interface";
import { ObjectId } from "mongodb";


export const postsRepository = {


  async createPost(data: CreatePostInterface): Promise<PostsInterface | null> {

    const blog: BlogInterface | null = await blogsQueryRepository.findBlogById(data.blogId)

    if (blog) {
      const newPost: PostDbInterface = {
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString()
      };

      const result = await postsCollection.insertOne(newPost);
      return {
        id: result.insertedId.toString(),
        title: newPost.title,
        shortDescription: newPost.shortDescription,
        content: newPost.content,
        blogId: newPost.blogId,
        blogName: newPost.blogName,
        createdAt: newPost.createdAt
      };
    } else {
      return null
    }

  },

  async updatePost(id: string, data: PostUpdateInterface): Promise<boolean> {

    const blog = await blogsQueryRepository.findBlogById(data.blogId)

    if (blog) {
      const result = await postsCollection.updateOne({ _id: new ObjectId(id)  }, {$set: {...data, blogName: blog.name}});
      return result.matchedCount === 1;
    } else {
      return false
    }

  },

  async deletePost(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },

  async createPostForBlog(data: CreatePostForBlogInterface, blog: BlogInterface): Promise<PostsInterface> {
    const newPost: PostDbInterface = {
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: new Date().toISOString()
    };

    const result = await postsCollection.insertOne(newPost)
    return {
      id: result.insertedId.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt
    };
  },

  test: async () => {
    const res = postsCollection.findOneAndUpdate({}, {$push: {}})
  }
};
