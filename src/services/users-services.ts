import { CreateUserInterface } from '../utilities/interfaces/users/user-interface';
import { hashData } from './password-services';
import { usersDbRepository } from '../repositories/users/users-db-repository';

export const usersServices = {

  createUser: async (data: CreateUserInterface) => {
    const hashPassword = await hashData(data.password)
    return await usersDbRepository.createUser({
      login: data.login,
      password: hashPassword,
      email: data.email
    });
  }
}
