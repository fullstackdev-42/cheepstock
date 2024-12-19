import { Controller, Get, Post, Req, Res, Session, Query, } from '@nestjs/common';
import { AnimatorSigninService } from './signin.service';
import { Request, Response } from 'express';
import { InviteService } from '../../invite/invite.service';
import { LoginService } from '../../login/login.service';
import { RealIP } from 'nestjs-real-ip';

@Controller()
export class AnimatorSigninController {
	private baseUrl:string;
  	constructor(
		private readonly animatorSigninService: AnimatorSigninService,
		private readonly inviteService: InviteService,
		private readonly loginService: LoginService
	) {
		this.baseUrl = "/cs-animator";
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
				return res.redirect('cs-admin/user_management');
			} else if(logged_user_type == "3") {
				return res.redirect(this.baseUrl + '/dashboard');
			} else {
				return res.redirect('cs-user/dashboard');
			}
		} else {
			return res.render('login/index.ejs', { baseUrl: this.baseUrl });
		}
  	}

	@Post('/dologin')
  	async doLogin(@Req() req: Request, @Res() res: Response, @Session() session, @RealIP() ipaddr): Promise<object> {
	    let email = req.body.email;
		email = email.toString();
	    var password = req.body.password;
	    password = password.toString();
		var accType = [3];

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
			resp['redirectUrl'] = this.baseUrl + '/sign_in';
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
  		return res.redirect(this.baseUrl + '/sign_in');
  	}

	@Get('/invited')
	async inviteValidate(@Query() query, @Res() res: Response) {
		res.locals = {};
		let invType = 3;
		if(query.user_email == undefined || query.token == undefined || query.user_email == "" || query.token == "") {
			res.locals.status = 1;
			res.locals.baseUrl = this.baseUrl;
			res.render('invite/status.ejs');
		} else {
			const serviceResp = await this.inviteService.signupValidate(query.user_email,query.token, invType);
			if(serviceResp['stat'] == 0){
				res.locals.email= serviceResp['email'];
				res.locals.accTyp = serviceResp['accTyp'];
				res.locals.baseUrl = this.baseUrl;
				res.render('invite/index.ejs');
			} else {
				res.locals.status = serviceResp['stat'];
				res.locals.baseUrl = this.baseUrl;
				res.render('invite/status.ejs');
			}
			return res.end();
		}
	}

	@Post('/complete_signup')
	async completeRegis(@Req() req: Request, @Res() res: Response) {
		let body = req.body;
		const resp = await this.inviteService.completeRegis(body);
		if(resp['stat'] == "Success") {
			var redirectUrl = this.baseUrl + "/sign_in";
			return res.status(200).json({msg: "success", succMsg: "SignUp Completed. Redirecting....", redirectUrl: redirectUrl});
		} else {
			return res.status(200).json({msg: "error", errMsg: "Error in signup process.Try again later."});
		}
	}
}