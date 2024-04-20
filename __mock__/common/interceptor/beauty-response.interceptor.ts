import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable, map } from "rxjs";

@Injectable()
export class BeautyResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const contentType = response.getHeader("Content-Type");
    const isAttachment = response.getHeader("Content-Disposition");
    const isJSON = /(application\/json)/i.test(contentType as string);
    // 流内容直接返回
    if ((contentType && !isJSON) || isAttachment) {
      return next.handle();
    } else {
      return next.handle().pipe(
        map(data => ({
          code: 200,
          data,
        }))
      );
    }
  }
}
