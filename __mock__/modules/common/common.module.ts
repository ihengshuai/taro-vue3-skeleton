import { resolve } from "path";
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import * as Joi from "joi";
import { HttpFilter } from "@/common/filter/http.filter";
import { LoggerMiddleware } from "@/common/middleware/log.middleware";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { GlobalConfiguration } from "@/config";
import { cwd } from "process";
import { CommonController } from "./common.controller";
import { BeautyResponseInterceptor } from "@/common/interceptor/beauty-response.interceptor";

@Module({
  imports: [
    // 配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(cwd(), "./.env"), resolve(cwd(), "./.env.production")],
      // ignoreEnvFile: true,
      load: [GlobalConfiguration],
      validationSchema: Joi.object({
        PORT: Joi.number(),
        NODE_ENV: Joi.string().valid("development", "production", "testing").required(),
      }),
    }),
  ],
  providers: [
    // filter
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
    // pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // 删除发送过来的不存在的属性
        whitelist: true,
        // 将传过来的类型转换为定义的类型，转换为 string、number、boolean和自定义类型
        transform: false,
        transformOptions: {
          enableImplicitConversion: true, // 隐式转换
        },
      }),
    },
    // interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: BeautyResponseInterceptor,
    },
  ],
  controllers: [CommonController],
})
export class CommonModule implements NestModule {
  // 全局配置中间件 需要实现 NestModule中configure方法
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'mock', method: RequestMethod.GET });
    // consumer
    //   .apply(LoggerMiddleware)
    //   .exclude('user')
    //   .forRoutes({ path: 'mock*', method: RequestMethod.ALL });
  }
}
