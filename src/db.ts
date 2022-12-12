import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from 'dotenv'
import { IBlogDb } from "./utilities/interfaces/blogs/blog-interface";
import { PostDbInterface } from "./utilities/interfaces/posts/posts-interface";
import { IUserDb } from './utilities/interfaces/users/user-interface';
import { ICommentDb } from './utilities/interfaces/comments/comments-interface';
import { DbRefreshToken } from './utilities/interfaces/auth/jwt-payload-interface';
dotenv.config()

const uri = process.env.MONGO_URI

if (!uri) {
  throw Error('mongo uri error')
}

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
const db = client.db('incubator')
export const blogsCollection = db.collection<IBlogDb>("blogs")
export const postsCollection = db.collection<PostDbInterface>("posts")
export const userColletion = db.collection<IUserDb>('users')
export const commentsColletion = db.collection<ICommentDb>('comments')
export const tokenCollection = db.collection<DbRefreshToken>('refresh-tokend')

export async function runDb() {
  try {
    await client.connect();
    await client.db("incubator").command({ ping: 1 });
    console.log("Connect successfully to mongo server");

  } catch(e) {
    console.log(e);
    console.log("Can't connect to mongo server");
    await client.close();
  }
}
