import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Users } from '../../../entities/users.entity';

import * as bcrypt from "bcryptjs";

@Injectable()
export class UserSignupService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>
    ) {}

    async doSignUp(userNew: object): Promise<Object> {
		let userRepo = getRepository(Users);
		let usrEmlMatch = await this.userRepository.createQueryBuilder('users')
		.select(["users.user_email"]).where("users.user_email = :email",{ email: userNew['email'] })
        .getCount()

        if(usrEmlMatch>0) {
        	return {msg: "error", errMsg: "E-Mail Id already registered with us!"};
        } else {
			userNew['password'] = await bcrypt.hash(userNew['password'],10);
			const dbOp = await userRepo.createQueryBuilder()
			.insert()
    		.into(Users)
			.values([{ user_id: null, user_name: userNew['name'],
				user_email: userNew['email'],
				password: userNew['password'],
				user_type: userNew['user_type'],
				status: userNew['active'],
				created_time_tstamp: userNew['created_time'],
			}])
			.execute();
        	if(dbOp) {
	            return { msg: "success", succMsg: "Registered Successfully!", redirectUrl: "/cs-user/sign_in"}
    	    } else {
        	    return { msg: "error", errMsg: "Processing Failed!, Try again later." }
        	}
		}
	}
}