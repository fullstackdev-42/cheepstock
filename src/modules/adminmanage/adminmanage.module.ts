import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity';
import { MailModule } from '../mail/mail.module';

import { AdminManageController } from './adminmanage.controller';
import { AdminManageService } from './adminmanage.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), MailModule],
    controllers: [AdminManageController],
    providers: [AdminManageService],

})
export class AdminManageModule {}