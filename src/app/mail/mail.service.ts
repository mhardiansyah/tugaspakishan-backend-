import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'; //import MailerService
import { MailPasswordDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  // async sendForgotPassword(payload: MailPasswordDto) {
  //   await this.mailService.sendMail({
  //     to: payload.email,
  //     subject: 'Lupa Password', // subject pada email
  //     template: './lupa_password', // template yang digunakan adalah lupa_password, kita bisa memembuat template yang lain
  //     context: {
  //       link: payload.link,
  //       name: payload.name,
  //     },
  //   });
  // }

  async sendVerificationEmail(payload: MailPasswordDto) {
    await this.mailService.sendMail({
      to: payload.email,
      subject: 'Verifikasi Email', // subject pada email
      template: './verifikasi_email', // template yang digunakan adalah verifikasi_email
      context: {
        name: payload.name,
        verification_token: payload.verification_token,
      },
    });
  }
}
