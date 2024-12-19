import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnimatorDashboardController } from './dashboard.controller';
import { AnimatorDashboardService } from './dashboard.service';
import { Users } from '../../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AnimatorDashboardController],
  providers: [AnimatorDashboardService],
})
export class AnimatorDashboardModule {}