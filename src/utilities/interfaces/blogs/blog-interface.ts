import { ObjectId } from "mongodb";

export interface BlogInterface {
  id: string,
  name: string,
  websiteUrl: string,
  description: string
  createdAt: string
}

export interface IBlogDb {
  name: string,
  websiteUrl: string,
  description: string
  createdAt: string
}
export type IBlogView =  {
  id: string
}  &  Omit<IBlogDb, '_id'>


export interface BlogDb {
  _id: ObjectId,
  name: string,
  websiteUrl: string,
  description: string
  createdAt: string
}
