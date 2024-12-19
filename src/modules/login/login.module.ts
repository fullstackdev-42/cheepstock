import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Users } from '../../entities/users.entity';

import { MailModule } from '../../modules/mail/mail.module';

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([Users])],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService]
})
export class LoginModule {}