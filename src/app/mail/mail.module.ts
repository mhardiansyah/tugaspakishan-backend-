import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || process.env.SECRET_KEY  ||'mail.smkmadinatulquran.sch.id', //sesuaikan konfigurasi 
        port: Number(process.env.MAIL_PORT) || 465 || 587,
        connectionTimeout: 20000,
        secure: true,
        logger: true,
        debug: true,
        auth: {
          user: process.env.MAIL_USER  || process.env.EMAIL_USER  || 'latihan-kirim-email@smkmadinatulquran.sch.id',  //sesuaikan user
          pass: process.env.MAIL_PASS ||  process.env.EMAIL_PASS  ||'SMKMQ2024', //sesuaikan password 
        },
      },
      defaults: {
        from: '"latihan-kirim-email@smkmadinatulquran.sch.id>',
      },
      template: {
        dir: join(__dirname,'templates'),  // template akan di ambil dari handlebar yang ada pada folder templates
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export  mailService agar bisa digunakan di luar module mail
})
export class MailModule {}