import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserDashboardController } from './dashboard.controller';
import { UserDashboardService } from './dashboard.service';
import { Users } from '../../../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserDashboardController],
  providers: [UserDashboardService],
})
export class UserDashboardModule {}