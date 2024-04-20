import { formatDate } from "@/utils";
import { sleep } from "@/utils/common";
import { Controller, ForbiddenException, Get, Param, Post } from "@nestjs/common";

@Controller("/api/mock")
export class MockController {
  @Get("/correct-request/:id")
  async renderHello(@Param("id") id: string) {
    await sleep(1000);
    return "Hi, I'm the data from server..." + id;
  }

  @Post("/business-error-request")
  async renderError() {
    await sleep(1000);

    throw new ForbiddenException({ error: "没有权限访问" });
  }

  @Get("/global-data")
  async renderGlobalData() {
    await sleep(1000);

    return {
      // eslint-disable-next-line camelcase
      user_name: "ihengshuai",
      // eslint-disable-next-line camelcase
      user_age: 18,
      // eslint-disable-next-line camelcase
      user_sex: "男",
    };
  }

  @Get("/gamelist/:gameId")
  async renderGameList(@Param("gameId") gameId: number) {
    await sleep(1000);

    return {
      gameId,
      apps: [
        { appName: "游戏1", appId: 1, appVersion: "1.0.0", date: "2020-01-01" },
        { appName: "游戏2", appId: 2, appVersion: "2.0.0", date: "2020-01-01" },
        { appName: "游戏3", appId: 3, appVersion: "3.0.0", date: "2020-01-01" },
        { appName: "游戏4", appId: 4, appVersion: "4.0.0", date: "2020-01-01" },
        { appName: "游戏5", appId: 5, appVersion: "5.0.0", date: "2020-01-01" },
      ],
    };
  }

  @Get("/user/:id")
  async getUserInfo(@Param("id") id: string) {
    await sleep(1500);

    return {
      id,
      name: "ihengshuai",
      time: formatDate(new Date(), "YYYY/MM/DD HH:mm:ss"),
    };
  }
}
