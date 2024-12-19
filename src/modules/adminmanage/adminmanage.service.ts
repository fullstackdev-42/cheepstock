import { Injectable } from'@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { MailService } from '../../modules/mail/mail.service';

@Injectable()
export class AdminManageService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        private readonly mailService: MailService
    ) {}
    
    async getUserList(offset : number, limit : number, name_search: string, req_type: number): Promise<object>{
        let resp = {users: [],counts: -1};
        
        let qry = await this.userRepository.createQueryBuilder('users').select(["users.user_id"])
        .where("users.user_type = :type",{type: req_type});

        if(name_search != ''){
            qry.andWhere("LOWER(users.user_name) like LOWER(:name_search)", {name_search: '%' + name_search + '%' });
        }
        let usrCount = await qry.getCount();
        

        let qry2 = await this.userRepository.createQueryBuilder('users').select(["users.*"])
        .where("users.user_type = :type",{type: req_type});

        if(name_search != ''){
            qry2.andWhere("LOWER(users.user_name) like LOWER(:name_search)", {name_search: '%' + name_search + '%' });
        }

        qry2.orderBy('users.user_id', 'DESC').offset(offset).limit(limit);
        let users = await qry2.getRawMany();

        resp.users = users;
        resp.counts = usrCount;
        return resp;
    }

    async adminUserInvite(emailId: string, inviteType: string): Promise<object> {
        let usrEmlMatch = await this.userRepository.createQueryBuilder('users')
        .select(["users.user_email","users.user_type"]).where("users.user_email = :email",{email: emailId})
        .getOne()

        if(usrEmlMatch != undefined) {
            let type="";
            if(usrEmlMatch.user_type == 1 || usrEmlMatch.user_type == 2) {
                type = "Admin.";
            } else if(usrEmlMatch.user_type == 3) {
                type = "Animator.";
            } else {
                type = "User.";
            }
        	return { msg: "error", errMsg: "Email ID already registered as " + type };
        } else {
            let token = "";
			let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var i = 16; i > 0; --i) token += chars[Math.floor(Math.random() * chars.length)];
            
            const retu = await this.userRepository.insert({
                user_id: null,
                user_email: emailId,
			    user_type: inviteType == "Admin" ? 2 : 3,
			    status: 0,
                invite_time: Date(),
                invite_token: token
            });
            if(retu) {
                let emailIdEncoded = Buffer.from(emailId).toString('base64');
                let tokenEncoded = Buffer.from(token).toString('base64');

                let url = process.env.SITE_URL+"/cs-" + inviteType.toLowerCase() + "/invited?user_email=" + emailIdEncoded + "&token=" + tokenEncoded;
				console.log(url);

            	var mailOptions = {
	                to: emailId,
	                from: process.env.FROM_EMAIL,
	                subject: process.env.SITE_NAME+" - " + inviteType + " Invitation",
	                template: 'invitation',
	                context: {
	                  siteurl: process.env.SITE_URL,
	                  email: emailId,
	                  inviteLink: url,
	                },
	            }
	            var serviceResp = await this.mailService.wrappedSendMail(mailOptions);
	            if(serviceResp){
		        	return {msg: "success", succMsg: "Invitation Link sent to the user successfully"};
		        } else {
		        	return {msg: "error", errMsg: "Error in sending invite link"};
		        }
            } else {
                return {msg: "error", errMsg: "Error in sending invite link"};
            }
        }
    }

    async deleteUsers(userList): Promise<object> {
        const dbOp =await this.userRepository.delete(userList);
        if(dbOp) {
            return {msg: "success", succMsg: "Delete Successful."}
        } else {
            return {msg: "failed", errMsg: "Delete Operation failed. Retry Later"}
        }
    }
}