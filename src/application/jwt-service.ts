import jwt from 'jsonwebtoken';
import { AccessTokenResponceInterface, JwtPayloadInterface } from '../utilities/interfaces/auth/jwt-payload-interface';

export const jwtService = {

  generateToken: async(payload: JwtPayloadInterface): Promise<AccessTokenResponceInterface> => {
    const key = process.env.JWT_SECRET || 'sckey';
    const token =  jwt.sign(payload, key, { expiresIn: '1h' });
    return {accessToken: token}
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
