import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
	constructor(
		private readonly mailerService: MailerService
	) {}
  	getHello(): string {
    	return 'Hello World!';
  	}
  	
    async wrappedSendMail(mailOptions: object){
        console.log("INSIDE");
        return {};
    	/*return new Promise((resolve,reject)=>{
            this.mailerService.sendMail(mailOptions).then((success) => {
            	//console.log("INSIDE EMAIL SUCCESS");
            	resolve(true);	                	
            }).catch((error) => {
            	//console.log(error);
            	resolve(false);
            })
        });*/
    }
}
