import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MailService } from './app/mail/mail.service';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
    useFactory: async () => {
      const { typeOrm } = await import('./app/config/typeorm.config');
      return typeOrm;
    },
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
