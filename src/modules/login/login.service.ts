import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Users } from '../../entities/users.entity';

import * as bcrypt from "bcryptjs";

import { MailService } from '../../modules/mail/mail.service';

@Injectable()
export class LoginService {
	constructor(
		@InjectRepository(Users)
		private readonly userRepository: Repository<Users>,
		private readonly mailService: MailService
	) {}
  	async doLogin(email: string, password: string, ipaddr: string, loginAccType: Array<number>): Promise<Object> {
		if(email == '' || password == '') {
            return {msg: "error", errMsg: "Invalid Email / Password"};
		} else {
			let userRepo = getRepository(Users);
			let user = await userRepo.createQueryBuilder("users")
			.andWhere("LOWER(users.user_email) = LOWER(:email)", { email: email })
			.getOne();
        	if(typeof user == "undefined"){
        		return {msg: "error", errMsg: "Email Address is not registered with us."};
			} else if(user['status'] == 0) {
				return {msg: "error", errMsg: "Your account is inactive. Contact Admin"};
			} else if(user['status'] == 2) {
				return {msg: "error", errMsg: "Your account is suspended. Contact Admin."};
			} else if(loginAccType.find(type => type == user.user_type) == undefined ) {
				if(loginAccType[0] == 1) {
					return {msg: "error", errMsg: "Your account is not registered as Admin."};
				} else if(loginAccType[0] == 3) {
					return {msg: "error", errMsg: "Your account is not registered as Animator."};
				} else {
					return {msg: "error", errMsg: "Your account is not registered as User."};
				}
			} else {
				let password_db = user.password;
               	if(bcrypt.compareSync(password, password_db) == true) {
					if(user['last_login_ip'] != '' && user['last_login_ip'] != null && user['user_type'] != 1 && user['last_login_ip'] != ipaddr) {
						let verifyCode = "";
						let chars = "0123456789";
	            		for (var i = 6; i > 0; --i) verifyCode += chars[Math.floor(Math.random() * chars.length)];

						var name = user.user_name;
						var emailId = user.user_email;

						var mailOptions = {
							to: emailId,
							from: process.env.FROM_EMAIL,
							subject: process.env.SITE_NAME+" - Verification Code",
	                		template: 'login_verification',
							context: {
								siteurl: process.env.SITE_URL,
								email: emailId,
								name: name,
								verifyCode: verifyCode
	                		},
	            		}
						await this.mailService.wrappedSendMail(mailOptions);
						user.invite_token = verifyCode;
            			await userRepo.save(user);

						return {msg: "iperror", user_id: user.user_id};
					} else {
                		user.last_login_tstamp = new Date();
                		user.last_login_ip = ipaddr;
                		await userRepo.save(user);
						let redirectUrl = '';
						if(user['user_type'] == 1 || user['user_type'] == 2) {
							redirectUrl = '/cs-admin/user_management';
						} else if(user['user_type'] == 3) {
							redirectUrl = '/cs-animator/dashboard';
						} else {
							redirectUrl = '/cs-user/dashboard';
						}
						return {msg: "success", succMsg: "Login Successful. Redirecting", usr: user, redirectUrl: redirectUrl};
					}
				} else {
					return {msg: "error", errMsg: "Invalid Password."};
				}
			}
		}
	}

	async verifyOtp(verifyDetails: object, newIp: string): Promise<object> {
		let userRepo = getRepository(Users);
		let user = await userRepo.createQueryBuilder("users")
		.where("users.user_id = :id",{id: verifyDetails['user_id']})
		.getOne()
		if(user.invite_token == verifyDetails['otp_code']) {
			user.last_login_ip = newIp;
			user.last_login_tstamp = new Date();
			user.invite_token = "";
			await userRepo.save(user);
			let redirectUrl = '';
			if(user.user_type == 1 || user.user_type == 2) {
				redirectUrl = '/cs-admin/user_management';
			} else if(user.user_type == 3) {
				redirectUrl = '/cs-animator/dashboard';
			} else {
				redirectUrl = '/cs-user/dashboard';
			}
			return { msg: "success", succMsg: "Login Successful. Redirecting", usr: user, redirectUrl: redirectUrl };
		} else {
			if(verifyDetails['attempt'] == 3) {
				user.status = 2;
				user.invite_token = "";
				await userRepo.save(user);
				return {msg: "suspended", errMsg: "Your Account has Been Suspended. Contact your Admin!"};
			}
			return {msg: "error", errMsg: "Incorrect OTP."};
		}
	}
}

//( || user['last_login_ip'] != '::ffff:' + ipaddr) for local IP