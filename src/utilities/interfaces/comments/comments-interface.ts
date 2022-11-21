import { ObjectId } from 'mongodb';

export interface CommentsInterface{
  id: string,
  content: string,
  userId: string,
  userLogin: string,
  createdAt: string
}

export interface ICommentDb{
  content: string,
  userId: ObjectId,
  userLogin: string,
  createdAt: string
}

export interface CommentsFromDbInterface {
  _id: ObjectId,
  content: string,
  userId: string,
  userLogin: string,
  createdAt: string
}

export interface CreateCommentInterface {
  content: string
}

export interface UpdateCommentInterface {
  content: string
}
