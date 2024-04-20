import { Injectable, /*Logger, */ NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { formatDate } from "@/utils";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const startTime = new Date();
    const method = req.method;
    const url = req.originalUrl;

    // const logger = new Logger();
    // logger.debug('loggermiddleware');

    res.on("finish", () => {
      console.log(
        `${method?.toUpperCase()}: ${url}\t\t\t 时间: ${formatDate(startTime)}\t 耗时: ${(
          (+new Date() - +new Date(startTime)) /
          1000
        )?.toFixed(3)}s`,
        "\n"
      );
    });
    next();
  }
}
