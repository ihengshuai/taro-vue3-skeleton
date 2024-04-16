import { HTTP_METHOD, InterceptorType } from "@/constants/http";
import type { IHttpRequestConfig, Interceptor } from "@/typings/common/http";

/** 必要的请求拦截器 */
export class NecessaryReqInterceptor implements Interceptor {
  static _ins: NecessaryReqInterceptor;
  type: InterceptorType = InterceptorType.REQUEST;

  async interceptor(config: IHttpRequestConfig): Promise<IHttpRequestConfig> {
    config.headers = config.headers || {};
    config.params = config.params || {};

    // TODO: 根据业务拦截请求参数
    config.headers["X-Locale"] = "zh";

    if (config.timeStamp && config.method === HTTP_METHOD.GET) {
      config.params._t = Date.now();
    }
    return config;
  }

  static get instance() {
    if (!this._ins) {
      this._ins = new NecessaryReqInterceptor();
    }
    return this._ins;
  }
}

/** 请求日志 */
export class LogReqInterceptor implements Interceptor {
  static _ins: LogReqInterceptor;
  type = InterceptorType.REQUEST;

  async interceptor(config: IHttpRequestConfig) {
    console.log(
      `%c 请求日志: %c${config.label ? `【${config.label}】` : ""}`,
      "background:gray;padding:2px 4px;color:#fff;font-weight:600",
      null,
      config
    );

    return config;
  }

  static get instance() {
    if (!this._ins) {
      this._ins = new LogReqInterceptor();
    }
    return this._ins;
  }
}
