import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(
  //   cookieSession({
  //     keys: ['mike-session'],
  //   }),
  // );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // 忽略 api 請求中多餘的屬性
  //   }),
  // );
  await app.listen(8080);
}
bootstrap();
