import { ObjectId } from 'mongodb';

export interface UserInterface{
  id: string
  login: string,
  password: string,
  email: string,
  createdAt: string
}

export interface CreateUserInterface{
  login: string,
  password: string,
  email: string
}

export interface IUserDb {
  password: string,
  login: string,
  email: string,
  createdAt: string
}

export interface UserCreateResponeIntrface {
  id: string
  login: string,
  email: string,
  createdAt: string
}

export interface UsersResponseInterface {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: UserCreateResponeIntrface[]
}

export interface UsersFromDbInterface {
  _id: ObjectId,
  login: string,
  email: string,
  createdAt: string
}
