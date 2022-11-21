import {
  CreateUserInterface, UserCreateResponeIntrface,
} from '../../utilities/interfaces/users/user-interface';
import { userColletion } from '../../db';
import { ObjectId } from 'mongodb';

export const usersDbRepository = {
  createUser: async (data: CreateUserInterface): Promise<UserCreateResponeIntrface> => {
    const user = {
      login: data.login,
      password: data.password,
      email: data.email,
      createdAt: new Date().toISOString()
    }

    console.log(user.password);

    const result = await userColletion.insertOne(user)

    return {
      id: result.insertedId.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
    }


  },
  deleteUser: async (userId: string): Promise<boolean> => {
    const result = await userColletion.deleteOne({_id: new ObjectId(userId)})
    return result.deletedCount === 1
  },
}
