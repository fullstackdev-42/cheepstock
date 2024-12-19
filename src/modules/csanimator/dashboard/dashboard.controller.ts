import { Controller, Get, Res, Session } from '@nestjs/common';
import { AnimatorDashboardService } from './dashboard.service';
import { Response } from 'express';

@Controller()
export class AnimatorDashboardController {
  	constructor(
		private readonly animatorDashboardService: AnimatorDashboardService
	) {}

	@Get('/')

	async root(@Res() res: Response, @Session() session) {
		let id = session.logged_user_id;
		let resp = await this.animatorDashboardService.getAnimator(id);
		res.locals.animatorName = resp['name'];
		return res.render('csanimator/index.ejs');
	}
}