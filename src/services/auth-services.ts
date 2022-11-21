import { LoginInterface } from '../utilities/interfaces/auth/login-interface';
import { hashData } from './password-services';
import { usersQueryRepository } from '../repositories/users/users-query-repository';
import { jwtService } from '../application/jwt-service';
import { AccessTokenResponceInterface } from '../utilities/interfaces/auth/jwt-payload-interface';

export const authServices = {
  login: async(data: LoginInterface): Promise<AccessTokenResponceInterface|null> => {
    const hashPassword = await hashData(data.password);
    const user = await usersQueryRepository.checkUserByLoginAndPas(hashPassword, data.loginOrEmail);
    return user ? await jwtService.generateToken({ _id: user._id, email: user.email, login: user.login }) : null;
  }
};

