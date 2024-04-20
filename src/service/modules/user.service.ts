import { useConfig } from "@/config";
import type { IHttpRequestConfig } from "@/typings/common/http";
import { HttpClientFrequently } from "@/utils";

const { __isDev__, USE_MOCK, MOCK_API, API_DOMAIN } = useConfig();

const BASE_URL = __isDev__ && USE_MOCK && !!MOCK_API ? MOCK_API : API_DOMAIN;
const httpInstance = HttpClientFrequently.instance;
httpInstance.setUserConfig({ baseURL: BASE_URL });

const USER_API = {
  /** 正确请求 */
  CONRECT_REQUEST: `/api/mock/correct-request/{userId}`, // userId为url路径参数
  /** 业务状态码错误 */
  BUSINESS_ERROR: `/api/mock/business-error-request`,
  /** 请求本身发生错误 */
  SERVER_ERROR: `/api/mock/server-error-request`,
  /** 获取用户信息 */
  USER_INFO: `/api/mock/user/{id}`,
};

/** 模拟正确请求 */
export function fetchUserMockData(userId: number, page = 1, pageSize = 10, config?: IHttpRequestConfig) {
  return httpInstance.get<string>(USER_API.CONRECT_REQUEST, {
    urlPath: {
      userId,
    },
    params: {
      page,
      pageSize,
      userIds: [1, 2, 3],
    },
    retryCount: 3,
    // captureError: false,
    timeStamp: true,
    ...config,
  });
}

/** 模拟业务状态码错误请求 */
export function fetchBusinessError(config?: IHttpRequestConfig) {
  return httpInstance.post(USER_API.BUSINESS_ERROR, {
    data: {
      page: 1,
      pageSize: 10,
    },
    retryCount: 3,
    timeStamp: true,
    ...config,
  });
}

/** 模拟自定义业务状态码错误钩子请求 */
export function fetchCustomBusinessErrorHook(config?: IHttpRequestConfig) {
  return httpInstance.post(USER_API.BUSINESS_ERROR, {
    ...config,
    // 当业务状态码 >= 500 时，认为请求失败
    customBusinessStatusHook: res => res.data.payload.code >= 500,
  });
}

/** 模拟服务器出错请求 */
export function fetchServerError(config?: IHttpRequestConfig) {
  return httpInstance.post(USER_API.SERVER_ERROR, {
    baseURL: "https://mockx.apifox1.com/ssdf/xxefault", // 一个不存在的地址模拟错误请求
    retryCount: 3,
    headers: {
      "is-server-error": true,
    },
    ...config,
  });
}

/**
 * 获取用户信息
 */
export function fetchUserInfo(userId: number, config?: IHttpRequestConfig) {
  return httpInstance.get<{ name: string; id: number; time: string }>(USER_API.USER_INFO, {
    urlPath: {
      id: userId,
    },
    ...config,
  });
}
