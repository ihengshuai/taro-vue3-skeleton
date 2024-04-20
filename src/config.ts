import { IConfig } from "@/typings/common/config";

/**
 * 获取项目配置
 */
export function useConfig(): IConfig {
  return {
    PUBLIC_PATH: BASE_URL || "/",
    ENV: NODE_ENV || "development",
    __isDev__: NODE_ENV === "development",
    __isProd__: NODE_ENV === "production",
    TIMEOUT: parseInt(TIMEOUT) || 1000 * 60 * 6,
    USE_MOCK: USE_MOCK === "true",
    MOCK_API: MOCK_API || null,
    COOKIE_DOMAIN: COOKIE_DOMAIN || "localhost",
    APP_ID: APP_ID,
    __isH5__: process.env.TARO_ENV === "h5",
    API_DOMAIN: API_DOMAIN || "/",
  };
}
