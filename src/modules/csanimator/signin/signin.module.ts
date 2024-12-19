import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimatorSigninController } from './signin.controller';
import { AnimatorSigninService } from './signin.service';
import { Users } from '../../../entities/users.entity';

import { LoginModule } from '../../login/login.module';
import { InviteModule } from '../../invite/invite.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), LoginModule, InviteModule],
  controllers: [AnimatorSigninController],
  providers: [AnimatorSigninService],
})
export class AnimatorSigninModule {}