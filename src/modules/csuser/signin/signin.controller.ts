import { Controller, Get, Post, Req, Res, Session, Render, } from '@nestjs/common';
import { UserSigninService } from './signin.service';
import { Request, Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { LoginService } from 'src/modules/login/login.service';


@Controller()
export class UserSigninController {
	private baseUrl: string;
  	constructor(
		private readonly usersigninService: UserSigninService,
		private readonly loginService: LoginService,
	) {
		this.baseUrl = "/cs-user";
	}

	@Get('/')
  	root(@Res() res: Response) {
		return res.redirect(this.baseUrl + '/sign_in');
	}

	@Get('/sign_in')
  	signIn(@Req() req: Request, @Res() res: Response, @Session() session) {
		if(typeof session.logged_user_id != "undefined" && session.logged_user_id > 0){
			let logged_user_type = session.logged_user_type;
			if(logged_user_type == "1" || logged_user_type == "2") {
				return res.redirect('/cs-admin/user_management');
			} else if(logged_user_type == "3") {
				return res.redirect('/cs-animator/dashboard');
			} else {
				return res.redirect(this.baseUrl + "/dashboard");
			}
		} else {
			return res.render('csuser/login/index.ejs');
		}
  	}

	@Post('/dologin')
  	async doLogin(@Req() req: Request, @Res() res: Response, @Session() session, @RealIP() ipaddr): Promise<object> {
	    let email = req.body.email;
	    let password = req.body.password;
		let accType = [4];

	    var resp = await this.loginService.doLogin(email, password, ipaddr, accType);
		if(resp['msg'] == "success") {
			session.logged_user_id = resp['usr']['user_id'].toString();
			session.logged_user_type = resp['usr']['user_type'].toString();
		}
		return res.status(200).json(resp);
	}

	@Post('/dologin_otp')
	async doLoginOtp(@Req() req: Request, @Res() res: Response, @Session() session, @RealIP() ipaddr): Promise<object>{
		const resp = await this.loginService.verifyOtp(req.body, ipaddr);
		if(resp['msg'] == "success") {
			session.logged_user_id = resp['usr']['user_id'].toString();
			session.logged_user_type = resp['usr']['user_type'].toString();
		} else if(resp['msg'] == "suspended") {
			resp['redirectUrl'] = this.baseUrl + "/sign_in";		
		}
		return res.status(200).json(resp);
	}

	@Get('/logout')
	logout(@Req() req: Request, @Res() res: Response, @Session() session) {
		if(typeof session.logged_user_id != "undefined" && session.logged_user_id != ""){
			delete session.logged_user_id;
			delete session.logged_user_type;
		}
		req.session.destroy(function() {});
		return res.redirect(this.baseUrl + "/sign_in");
	}
}