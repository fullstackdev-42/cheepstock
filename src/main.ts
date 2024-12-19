import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as session from 'express-session';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
	app.setViewEngine('ejs');

	app.enableCors();
	app.use(json({
		type: ['application/json', '*/*']
	}));
  	app.use(
	  session({
	    secret: 'G137Z61V2P',
	    resave: false,
	    saveUninitialized: false,
	  }),
	);

	await app.listen(3000);
}
bootstrap();
