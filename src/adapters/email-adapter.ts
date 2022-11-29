import nodemailer from 'nodemailer';
import { v4 } from 'uuid';

export const emailAdapter = {
  sendCodeToEmail: async (email: string, subject: string): Promise<string> => {

    let code = v4()

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testkokorin@gmail.com",
        pass: "fnzilbgyyhysnapd",
      },
    });


    let messageEmail = {
      from: "test",
      to: email,
      subject: subject,
      html: ` <h1>Thank for your registration</h1>
       <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
      </p>`
    };

    let info = await transporter.sendMail(messageEmail)
    return code

  }
}
