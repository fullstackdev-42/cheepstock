import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "src/entities/users.entity";
import * as bcrypt from "bcryptjs";


@Injectable()
export class InviteService {
    constructor(
        @InjectRepository(Users)
		private readonly userRepository: Repository<Users>
	) {}
    async signupValidate(mailIdEncoded: string, invTokenEncoded: string, inviteType: number): Promise<Object>{
        let resp = {stat: 0, msg: "", email: "", accTyp: ""};

        let mailId = Buffer.from(mailIdEncoded, 'base64').toString();
        let invToken = Buffer.from(invTokenEncoded, 'base64').toString();

        let user = await this.userRepository.createQueryBuilder('users')
        .where("LOWER(users.user_email) = LOWER(:email)", { email: mailId }).getOne();
        if(typeof user == "undefined"){
            resp.stat = 1;
        } else if(user['status'] != 0) {
            resp.stat = 2;
        } else if(user['invite_token'].toString() != invToken) {
            resp.stat = 1;
        } else if(user['user_type'] != inviteType) {
            resp.stat = 1;
        } else {
            let creationTime = user['invite_time'].getTime();
            let current = new Date().getTime();
            let duration = Math.floor((current - creationTime)/1000/60/60);
            if(duration >= 24) {
                resp.stat = 3;
                await this.userRepository.delete(user);
            } else {
                resp.stat = 0;
                resp.email = user['user_email'];
                resp.accTyp = user['user_type'].toString();
            }
        }
        return resp;
    }
    async completeRegis(user: object): Promise<Object> {
        let resp = {stat: ""};
        user['password'] = await bcrypt.hash(user['password'],10);

        const dbOp = await this.userRepository.createQueryBuilder()
        .update(Users).set({
            user_name: user['name'],
            password: user['password'],
            status: 1,
            created_time_tstamp: Date(),
            invite_token: "",
            invite_time: null
        })
        .where("user_email = :email",{email: user['email']})
        .execute();

        if(dbOp) {
            resp.stat = "Success";
        } else {
            resp.stat = "Error";
        }
        return resp;
    }
}