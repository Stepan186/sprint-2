import { blogsCollection } from "../../db";
import { BlogInterface, IBlogDb } from "../../utilities/interfaces/blogs/blog-interface";
import { ObjectId } from "mongodb";

export const blogsRepository = {

  async createBlog(data: BlogCreateInterface): Promise<BlogInterface> {
    const newBlog: IBlogDb = { name: data.name, websiteUrl: data.websiteUrl, description: data.description, createdAt: new Date().toISOString()};
    const result = await blogsCollection.insertOne(newBlog);
    return { id: result.insertedId.toString(), name: newBlog.name, description: newBlog.description, websiteUrl: newBlog.websiteUrl, createdAt: newBlog.createdAt}
  },

 async updateBlog (id: string, data: BlogUpdateInterface): Promise<boolean> {
    const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {$set: {...data}})
    return result.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
    return result.deletedCount === 1
  }
};
