import { ObjectId } from 'mongodb';

export interface AccessTokenResponceInterface {
  accessToken: string
}

export interface JwtPayloadInterface {
  _id: ObjectId,
  email: string,
  login: string
}
