import { ObjectId } from 'mongodb';

export interface TokensInterface {
  accessToken: string
  refreshToken: string
}

export interface JwtPayloadInterface {
  _id: ObjectId,
  email: string,
  login: string
}

export interface GetMeInterface {
  userId: string,
  email: string,
  login: string
}


export interface DbRefreshToken {
  token: string
}

export interface RefreshTokenFromDb {
  token: string,
  _id: ObjectId
}
