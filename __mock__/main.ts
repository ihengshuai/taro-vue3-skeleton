import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { GlobalConfiguration } from "./config";
import { Request, Response } from "express";
import { resolve } from "path";
import { cwd } from "process";
import { readFileSync } from "fs";

async function bootstrap() {
  const config = GlobalConfiguration();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["error", "warn", "debug"],
    ...(config.__isHttps__
      ? {
          httpsOptions: {
            key: readFileSync(config.SSL_CERTIFICATE_KEY!),
            cert: readFileSync(config.SSL_CERTIFICATE!),
          },
        }
      : {}),
  });

  app.enableCors((req: Request, cb) =>
    cb(null, {
      origin: req.headers.origin,
      methods: ["PUT, POST, GET, DELETE, OPTIONS"],
      allowedHeaders: ["x-locale", "authorization", "Content-Type"],
      credentials: true,
    })
  );

  // 静态资源服务
  app.useStaticAssets(resolve(cwd(), "./public"), {
    dotfiles: "deny",
    index: false,
    setHeaders(res: Response, path: string) {
      setCustomCacheControl(res, path);
    },
  });

  await app.listen(config.PORT, () => {
    console.log(`Application is running on ${config.PORT} port.\n`);
    console.log(`   - Current Env：${config.NODE_ENV}.`);
    console.log(
      `   - Client Server： ${config.__isHttps__ ? "https" : "http"}://localhost:${
        config.PORT
      } (若配置了域名请换成域名)\n`
    );
  });
}

bootstrap().catch(err => {
  console.log(err);
  process.exit(1);
});

function setCustomCacheControl(res: Response, path: string) {
  // Custom Cache-Control for HTML files
  if (/.*\.html\??.*/i.test(path)) {
    res.setHeader("Cache-Control", "no-store");
  } else {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
}
