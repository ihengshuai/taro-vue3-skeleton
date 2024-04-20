import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const code = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorException = exception instanceof HttpException ? exception?.getResponse?.() : exception;

    // 定义错误格式
    const error = {
      code,
      message: typeof errorException === "string" ? errorException : (errorException as any)?.message || errorException,
      error: (errorException as any)?.error,
      timestamp: new Date().toISOString(),
    };

    console.error(`【HTTP_FILTER】`, exception.getResponse() || exception, "\n");

    try {
      response.status(200).json({ ...error });
    } catch (error) {
      response.end();
    }
  }
}
