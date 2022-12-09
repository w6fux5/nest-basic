import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // 發送請求之前
    // do some thing..

    return handler.handle().pipe(
      map((data: any) => {
        // 回傳數據之前
        // do some thing..
        return plainToInstance(this.dto, data, {
          // 只會發送 Dto 包含 @Expose 攔截器的數據，如果沒有設定為 true,
          // 所有 Dto 裡面的東西都會被發送出去
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
