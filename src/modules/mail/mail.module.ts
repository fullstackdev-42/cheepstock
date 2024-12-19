import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}