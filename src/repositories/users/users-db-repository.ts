import {
  CreateUserInterface, IUserDb, UserCreateResponeIntrface, UserInterface,
} from '../../utilities/interfaces/users/user-interface';
import { userColletion } from '../../db';
import { ObjectId } from 'mongodb';

export const usersDbRepository = {
  createUser: async(data: CreateUserInterface): Promise<UserCreateResponeIntrface> => {
    const user = {
      login: data.login,
      password: data.password,
      email: data.email,
      createdAt: new Date().toISOString(),
      emailConfirm: false,
      codeConfirm: false,
      code: null
    };

    const result = await userColletion.insertOne(user);

    return {
      id: result.insertedId.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt
    };


  },
  deleteUser: async (userId: string): Promise<boolean> => {
    const result = await userColletion.deleteOne({_id: new ObjectId(userId)})
    return result.deletedCount === 1
  },

  findUserByEmailOrLogin: async (email: string, login: string): Promise<null | IUserDb> => {
    const user = await userColletion.findOne({$or: [{email: email}, {login: login}]})
    return user ? user : null
  },

  updateConfirmation: async (id: string): Promise<boolean> => {
    let result = await userColletion.updateOne({_id: new ObjectId(id)}, {$set: {emailConfirm: true}})
    return result.matchedCount === 1
  },

  updateCode: async (id: string, code: string): Promise<boolean> => {
    let result = await userColletion.updateOne({_id: new ObjectId(id)}, {$set: {code: code} })
    return result.matchedCount === 1
  },

  findUserByConfirmationCode: async (code: string): Promise<null | UserInterface> => {
    const user = await userColletion.findOne({code: code})
    return user ? {...user, id: user._id.toString()} : null
},

  findUserByEmail: async(email:string): Promise<UserInterface | null> => {
    const user = await userColletion.findOne({email: email})
    return user ? {...user, id: user._id.toString()} : null
  }
}
