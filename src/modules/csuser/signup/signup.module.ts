import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSignupController } from './signup.controller';
import { UserSignupService } from './signup.service';
import { Users } from '../../../entities/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    controllers: [UserSignupController], 
    providers: [UserSignupService],

})
export class UserSignupModule {};