/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoleService } from './app/auth/role.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const roleService = app.get(RoleService);
  await roleService.seedDefaultRoles();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
