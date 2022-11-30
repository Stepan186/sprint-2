import { UserInterface } from './users/user-interface';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserInterface | null
    }
  }
}
