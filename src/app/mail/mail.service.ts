import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'; //import MailerService
import { MailResetPasswordDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendForgotPassword(payload: MailResetPasswordDto) {
    await this.mailService.sendMail({
      to: payload.email,
      subject: 'Lupa Password', // subject pada email
      template: './lupa_password',  // template yang digunakan adalah lupa_password, kita bisa memembuat template yang lain
      context: {
        link: payload.link,
        name: payload.name,
      },
    });
  }
  async sendVerificationEmail(email: string, verification_token: string,) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Verifikasi Email', // subject pada email
      template: './verifikasi_email', // template yang digunakan adalah verifikasi_email
      context: {
        verification_token: verification_token,
      },
    });
  }
}