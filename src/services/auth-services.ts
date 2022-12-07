import { LoginInterface } from '../utilities/interfaces/auth/login-interface';
import { hashData } from './password-services';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { jwtService } from '../application/jwt-service';
import {
  GetMeInterface,
  JwtPayloadInterface, TokensInterface
} from '../utilities/interfaces/auth/jwt-payload-interface';
import { usersDbRepository } from '../repositories/users/users-db-repository';
import { CreateUserInterface, UserInterface } from '../utilities/interfaces/users/user-interface';
import { businessSerivce } from '../domain/business-serivce';

export const authServices = {
  login: async(data: LoginInterface): Promise<TokensInterface|null> => {
    const hashPassword = await hashData(data.password);
    const user = await usersQueryRepository.checkUserByLoginAndPas(hashPassword, data.loginOrEmail);
    return user ? await jwtService.generateToken({ _id: user._id, email: user.email, login: user.login }) : null;
  },

  registration: async(data: CreateUserInterface): Promise<boolean> => {
    data.password = await hashData(data.password);
    const newUser = await usersDbRepository.createUser(data);
    const code = await businessSerivce.sendCode(data.email);
    return await usersDbRepository.updateCode(newUser.id, code);
  },

  confirmEmail: async(code: string): Promise<boolean> => {
    let user = await usersDbRepository.findUserByCode(code);
    if (user) return await usersDbRepository.updateConfirmation(user.id);
    return false
  },

  resending: async(user: UserInterface, email: string): Promise<boolean> => {
    const code = await businessSerivce.sendCode(email);
    return await usersDbRepository.updateCode(user.id, code);
  },

  getMe: async (token: string): Promise<GetMeInterface> => {
    const payload: JwtPayloadInterface = await jwtService.decodeToken(token) as JwtPayloadInterface
    return {userId: payload._id.toString(), email: payload.email, login: payload.login }
  }
};

