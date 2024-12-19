import { Controller, Get, Post, Req, Res, Render } from '@nestjs/common';
import { UserSignupService } from './signup.service';
import { Request, Response } from 'express';

@Controller()
export class UserSignupController {
    constructor( private readonly userSignupService: UserSignupService ) {}

    @Get('/')
    @Render('csuser/signup/index.ejs')
    signup() {		
        return;
    }

    @Post('/dosignup')
    async doSignUp(@Req() req: Request, @Res() res: Response) {
        let newUser = {	id: null, name:"", email: "",
            password:"", user_type: "4",
            active: "1", created_time: Date()
        };
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        const resp = await this.userSignupService.doSignUp(newUser);
        return res.send(resp);
    }
}