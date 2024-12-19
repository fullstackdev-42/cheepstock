import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminSigninController } from './signin.controller';
import { AdminSigninService } from './signin.service';
import { Users } from '../../../entities/users.entity';

import { LoginModule } from '../../login/login.module';
import { InviteModule } from '../../invite/invite.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), LoginModule, InviteModule],
  controllers: [AdminSigninController],
  providers: [AdminSigninService],
})
export class AdminSigninModule {}