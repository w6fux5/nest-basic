/*=============================================
   1. 攔截請求，拿到 request session 裡面的 userID
   2. 利用 userID 拿到 user entity
   3. 將 user entity 加到 request 的 currentUser
   4. 因為執行順序的關係，改為使用 middleware
   5. request => middleware => guard 
      => interceptor => request handler
      => interceptor => response
   6. 如果 currentUser在攔截器添加，guard 會拿不到
      數據，因此改成 middleware 
=============================================*/

import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userID } = request.session || {};

    if (userID) {
      const user = await this.usersService.findOne(userID);
      request.currentUser = user;
    }

    return next.handle();
  }
}
