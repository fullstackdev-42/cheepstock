import { Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminManageService } from './adminmanage.service';
import {renderFile} from "ejs";

@Controller()
export class AdminManageController {
    constructor(private readonly adminManageService: AdminManageService) {}

    @Get()
    async rootGet(@Res() res: Response, @Session() session) {
        let req_type = parseInt(session.logged_user_type) + 1;
        const servResp = await this.adminManageService.getUserList(0, 10, '', req_type);
        res.locals.users = servResp['users'];
        res.locals.counts = servResp['counts'];

        return res.render('csadmin/adminmanage/index.ejs');
    }

    @Post('/paginateUser')
    async paginateUser(@Req() req: Request, @Res() res: Response, @Session() session) {
        var page = req.body.page;
        let req_type = parseInt(session.logged_user_type) + 1;
        var name_search = req.body.name_search;

        var limit = 10;
        var offset = ((Number(page) - 1) * limit);

        const servResp = await this.adminManageService.getUserList(offset, limit, name_search, req_type);
        var users = servResp['users'];
        var userdata_count = servResp['counts'];

        var pass_template = {
            users: users,
            userdata_count: userdata_count
        }

        var viewsDir = process.cwd() + '/src/views/csadmin/adminmanage/';
        var email_content = await renderFile(viewsDir + '/paginate.ejs',pass_template);
        return res.send(email_content);
    }

    @Post('/inviteUser')
  	async inviteUser(@Req() req: Request, @Res() res: Response, @Session() session) {
  		let inviteEmail = req.body.inviteEmail;
		let inviteType = req.body.inviteType;
  		const serviceResp = await this.adminManageService.adminUserInvite(inviteEmail, inviteType);
  		return res.status(200).json(serviceResp);
  	}

    @Post('/delete_user')
    async deleteUser(@Req() req: Request, @Res() res: Response) {
        const resp = await this.adminManageService.deleteUsers(req.body.userList.map(x => + x));
        return res.status(200).json(resp);
    }
}