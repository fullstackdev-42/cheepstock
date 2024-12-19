import { Injectable, NestMiddleware } from '@nestjs/common';

import { Response, NextFunction } from 'express';

import { IRequest } from "../types/index.d";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: IRequest, res: Response, next: NextFunction) {
        let url = req.originalUrl;
        let pageGroup = {};
        let pageGroups  = [
            {
                url: '/cs-admin/',
                public_pages: ["/cs-admin/sign_in","/cs-admin/dologin"],
                excluded_pages: ["/cs-admin/invited","/cs-admin/complete_signup"]
            },
            {
                url: '/cs-animator/',
                public_pages: ["/cs-animator/sign_in","/cs-animator/dologin"],
                excluded_pages: ["/cs-animator/invited","/cs-animator/complete_signup"]
            },
            {
                url: '/cs-user/',
                public_pages: ["/cs-user/sign_in","/cs-user/dologin"],
                excluded_pages: ["/cs-user/sign_up","/cs-user/complete_signup"]
            }
        ]
        pageGroups.forEach(element => {
            if(url.includes(element.url)) {
                pageGroup = element;
            }
        });
        if(Object.keys(pageGroup).length != 0) {
            let chk1 = pageGroup['public_pages'].find(a => url.includes(a));
            let chk2 = pageGroup['excluded_pages'].find(a => url.includes(a));

            if(typeof req.session.logged_user_id != "undefined") {
                let logged_user_id = req.session.logged_user_id;
                if(typeof logged_user_id == "undefined" || logged_user_id == null || logged_user_id == "") {
                    if(typeof chk1 != "undefined" || typeof chk2 != "undefined") {
                        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                        res.header('Expires', '-1');
                        res.header('Pragma', 'no-cache');
                        res.locals.sessionval = req.session;
                        next();
                    } else {
                        return res.redirect(pageGroup['url'] + "sign_in");
                    }
                } else {
                    if(typeof chk1 == "undefined") {
                        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                        res.header('Expires', '-1');
                        res.header('Pragma', 'no-cache');
                        res.locals.sessionval = req.session;
                        next();
                    } else {
                        if(pageGroup['url'] == "/cs-admin/") {
                            return res.redirect(pageGroup['url'] + "user_management");
                        } else {
                            return res.redirect(pageGroup['url'] + "dashboard");
                        }
                    }
                }
            } else {
                if(typeof chk1 != "undefined" || typeof chk2 != "undefined") {
                    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                    res.header('Expires', '-1');
                    res.header('Pragma', 'no-cache');
                    res.locals.sessionval = req.session;
                    next();
                } else {
                    return res.redirect(pageGroup['url'] + "sign_in");
                }
            }
        } else {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.locals.sessionval = req.session;
            next();
        }
    }
};