declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

// @ts-ignore
declare const process: {
  env: {
    /**
     * appId：当前小程序id
     */
    TARO_APP_ID: string;
    /**
     * 平台
     */
    TARO_ENV: "weapp" | "swan" | "alipay" | "h5" | "rn" | "tt" | "quickapp" | "qq";

    [key: string]: any;
  };
};

declare module "@tarojs/components" {
  export * from "@tarojs/components/types/index.vue3";
}

declare const VERSION: string;

/**
 * APP id
 */
declare const APP_ID: string;

/**
 * 是否开启mock
 */
declare const USE_MOCK: string;
/**
 * mock api
 */
declare const MOCK_API: string;
/**
 * 公共路径
 */
declare const BASE_URL: string;
/**
 * 环境
 */
declare const NODE_ENV: "development" | "production";
/**
 * 请求超时时间
 */
declare const TIMEOUT: string;
/**
 * 接口地址
 */
declare const API_DOMAIN: string;

/**
 * Cookie Domain
 */
declare const COOKIE_DOMAIN: string;
