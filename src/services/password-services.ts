import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv';
import { JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
dotenv.config()


export function hashData(password: string) {

  const salt = process.env.SALT
  return bcrypt.hash(password, salt ? salt : 10)

}
