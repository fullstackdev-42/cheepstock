import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/entities/users.entity";
import { InviteController } from "./invite.controller";
import { InviteService } from "./invite.service";

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    controllers: [InviteController],
    providers: [InviteService],
    exports: [InviteService]
})
export class InviteModule {}