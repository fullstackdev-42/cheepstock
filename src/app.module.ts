import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from './middleware/logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminSigninModule } from './modules/csadmin/signin/signin.module';
import { LoginModule } from './modules/login/login.module';
import { AdminManageModule } from './modules/adminmanage/adminmanage.module';
import { InviteModule } from './modules/invite/invite.module';
import { MailModule} from './modules/mail/mail.module';

import { RouterModule, Routes } from 'nest-router';

import { MailerModule} from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AnimatorSigninModule } from './modules/csanimator/signin/signin.module';
import { AnimatorDashboardModule } from './modules/csanimator/dashboard/dashboard.module';
import { UserSigninModule } from './modules/csuser/signin/signin.module';
import { UserSignupModule } from './modules/csuser/signup/signup.module';
import { UserDashboardModule } from './modules/csuser/dashboard/dashboard.module';

const routes: Routes = [
  {
    path: '/cs-admin',
    module: AdminSigninModule,
    children: [
      {
        path: '/user_management',
        module: AdminManageModule,
      }
    ],
  },
  {
    path: '/cs-animator',
    module: AnimatorSigninModule,
    children: [
      {
        path: '/dashboard',
        module: AnimatorDashboardModule,
      }
    ],
  },
  {
    path: "/cs-user",
    module: UserSigninModule,
    children: [
      {
        path: '/dashboard',
        module: UserDashboardModule,
      },
      {
        path: '/sign_up',
        module: UserSignupModule,
      }
    ]
  }
];

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'dev.cheepstock@gmail.com',
          pass: 'dev@cheepstocK'
        },
      },
      defaults: {
        from: '"CheepStock" <noreply@cheepstock.com>'
      },
      template: {
        dir: process.cwd() + '/src/views/emails/',
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        }
      }
    }),
    RouterModule.forRoutes(routes),
    AdminSigninModule,
    LoginModule,
    AdminManageModule,
    InviteModule,
    MailModule,
    AnimatorSigninModule,
    AnimatorDashboardModule,
    UserSigninModule,
    UserSignupModule,
    UserDashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule {
	constructor(private connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes({ 
        path: '*', method: RequestMethod.ALL 
      });
  }
}