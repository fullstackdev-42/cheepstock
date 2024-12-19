import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService
	) {}

    async wrappedSendMail(mailOptions: object){
    	return new Promise((resolve,reject)=>{
            this.mailerService.sendMail(mailOptions).then((success) => {
            	//console.log("INSIDE EMAIL SUCCESS");
            	resolve(true);	                	
            }).catch((error) => {
            	//console.log(error);
            	resolve(false);
            })
        });
    }
}