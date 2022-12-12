import jwt from 'jsonwebtoken';
import {
  JwtPayloadInterface,
  TokensInterface
} from '../utilities/interfaces/auth/jwt-payload-interface';

export const jwtService = {

  generateToken: async(payload: JwtPayloadInterface): Promise<TokensInterface> => {
    const key = process.env.JWT_SECRET || 'sckey';
    const acToken =  jwt.sign(payload, key, { expiresIn: '10sec' });
    const rfToken = jwt.sign(payload, key, {expiresIn: '20sec'})
    return {accessToken: acToken, refreshToken: rfToken}
  },

  decodeToken: async (token: string) => {
    const key = process.env.JWT_SECRET || 'sckey';
    try {
      return jwt.verify(token, key)
    } catch (e) {
      return false
    }
  },
};
