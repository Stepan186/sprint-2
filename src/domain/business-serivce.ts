import { emailAdapter } from '../adapters/email-adapter';

export const businessSerivce = {
  async sendCode (email: string): Promise<string> {
    return await emailAdapter.sendCodeToEmail(email, 'auth code')
  },
}
