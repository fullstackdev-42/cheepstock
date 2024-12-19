import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { LoginModule } from 'src/modules/login/login.module';

import { UserSigninController } from './signin.controller';
import { UserSigninService } from './signin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), LoginModule],
  controllers: [UserSigninController],
  providers: [UserSigninService],
})
export class UserSigninModule {}