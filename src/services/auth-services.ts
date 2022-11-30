import { LoginInterface } from '../utilities/interfaces/auth/login-interface';
import { hashData } from './password-services';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { jwtService } from '../application/jwt-service';
import {
  AccessTokenResponceInterface,
  GetMeInterface,
  JwtPayloadInterface
} from '../utilities/interfaces/auth/jwt-payload-interface';
import { usersDbRepository } from '../repositories/users/users-db-repository';
import { CreateUserInterface } from '../utilities/interfaces/users/user-interface';
import { businessSerivce } from '../domain/business-serivce';

export const authServices = {
  login: async(data: LoginInterface): Promise<AccessTokenResponceInterface|null> => {
    const hashPassword = await hashData(data.password);
    console.log();
    const user = await usersQueryRepository.checkUserByLoginAndPas(hashPassword, data.loginOrEmail);
    return user ? await jwtService.generateToken({ _id: user._id, email: user.email, login: user.login }) : null;
  },

  registration: async(data: CreateUserInterface): Promise<boolean> => {
    const user = await usersDbRepository.findUserByEmailOrLogin(data.email, data.login);
    if (!user) {
      data.password = await hashData(data.password)
      const newUser = await usersDbRepository.createUser(data);
      const code = await businessSerivce.sendCode(data.email);
      return await usersDbRepository.updateCode(newUser.id, code);
    }
    return false;
  },

  confirmEmail: async(code: string): Promise<boolean> => {
    let user = await usersDbRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    if (user.codeConfirm) return false
    if (user.emailConfirm) return false;
    return await usersDbRepository.updateConfirmation(user.id);
  },

  resending: async(email: string): Promise<boolean> => {
    const user = await usersDbRepository.findUserByEmail(email);
    if (!user) return false;
    if (user.emailConfirm) return false
    const code = await businessSerivce.sendCode(email);
    return await usersDbRepository.updateCode(user.id, code);
  },

  getMe: async (token: string): Promise<GetMeInterface> => {
    const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
    return {userId: payload._id.toString(), email: payload.email, login: payload.login }
  }
};

