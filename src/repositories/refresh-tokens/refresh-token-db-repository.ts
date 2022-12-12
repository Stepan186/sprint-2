import { tokenCollection } from '../../db';
import { RefreshTokenFromDb } from '../../utilities/interfaces/auth/jwt-payload-interface';

export const refreshTokenDbRepository = {
  createRfToken: async(token: string): Promise<void> => {
    const newToken = await tokenCollection.insertOne({token})
  },

  findRfRoken: async (data: string): Promise<RefreshTokenFromDb | null> => {
    const token = await tokenCollection.findOne({token: data})
    return token ? token : null
  }
};
