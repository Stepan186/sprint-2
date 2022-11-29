import { LoginInterface } from '../utilities/interfaces/auth/login-interface';
import { hashData } from './password-services';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { jwtService } from '../application/jwt-service';
import { AccessTokenResponceInterface } from '../utilities/interfaces/auth/jwt-payload-interface';
import { usersDbRepository } from '../repositories/users/users-db-repository';
import { CreateUserInterface, IUserDb } from '../utilities/interfaces/users/user-interface';
import { businessSerivce } from '../domain/business-serivce';
import { emailAdapter } from '../adapters/email-adapter';
import { userColletion } from '../db';
import { commentsDbRepository } from '../repositories/comments/comments-db-repository';

export const authServices = {
  login: async(data: LoginInterface): Promise<AccessTokenResponceInterface|null> => {
    const hashPassword = await hashData(data.password);
    const user = await usersQueryRepository.checkUserByLoginAndPas(hashPassword, data.loginOrEmail);
    return user ? await jwtService.generateToken({ _id: user._id, email: user.email, login: user.login }) : null;
  },

  async registration (data: CreateUserInterface): Promise<boolean> {
    const user = await usersDbRepository.findUserByEmailOrLogin(data.email)
    if (!user) {
      const newUser = await usersDbRepository.createUser(data)
      const code = await businessSerivce.sendCode(data.email)
      return await usersDbRepository.updateCodeConfirmation(newUser.id, code)
    }
    return false
  },

  async confirmEmail (code: string): Promise<boolean> {
    let user = await usersDbRepository.findUserByConfirmationCode(code)
    if (!user) return false
    if (user.emailConfirm) return false
    return await usersDbRepository.updateConfirmation(user.id)
  },

  async resending (email: string): Promise<boolean> {
    const user = await usersDbRepository.findUserByEmail(email)
    if (!user || user.emailConfirm) return false
    const code = await businessSerivce.sendCode(email)
    return await usersDbRepository.updateCodeConfirmation(user.id, code)
  }

};

