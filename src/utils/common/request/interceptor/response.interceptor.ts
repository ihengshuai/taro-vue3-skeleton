import { InterceptorType } from "@/constants/http";
import type { Interceptor, IInterceptorData, IHttpError } from "@/typings/common/http";
import { snakeToCamel } from "@/utils";

/** 必要的响应拦截器 */
export class NecessaryResInterceptor implements Interceptor {
  static _ins: NecessaryResInterceptor;
  type = InterceptorType.RESPONSE;

  async interceptor(res: IInterceptorData) {
    return new Promise((resolve, reject) => {
      const data = res.data;
      const config = res.config;

      // 将http请求状态码不合法的直接抛出
      if (data.statusCode >= 300) {
        const error = new Error("") as IHttpError;
        error.code = data.statusCode;
        error.config = config;
        error.response = data;
        return reject(error);
      }

      // 拿到服务器返回的数据
      const payload = data.payload;
      const customBusinessStatus = config.customBusinessStatusHook?.(res);
      const isBusinessError = typeof customBusinessStatus === "boolean" ? customBusinessStatus : payload.code >= 300;

      // 业务状态码错误时抛出
      if (isBusinessError) {
        // TODO: 按需补充业务逻辑
        const error = new Error(payload.error || "出错了...") as IHttpError;
        error.code = payload.code;
        error.config = config;
        error.response = data;
        error.isBusinessError = true;

        return reject(error);
      }
      resolve(res);
    });
  }

  static get instance() {
    if (!this._ins) {
      this._ins = new NecessaryResInterceptor();
    }
    return this._ins;
  }
}

/** 修剪最终的数据格式返回调用处 */
export class BeautifyResInterceptor implements Interceptor {
  static _ins: BeautifyResInterceptor;
  type = InterceptorType.RESPONSE;

  async interceptor(res: IInterceptorData): Promise<any> {
    const config = res.config;
    const { transferToCamel } = config;

    // TODO: 根据业务情况调整
    const payload = res.data.payload;
    return transferToCamel !== false ? snakeToCamel(payload.data) : payload.data;
  }

  static get instance() {
    if (!this._ins) {
      this._ins = new BeautifyResInterceptor();
    }
    return this._ins;
  }
}

/** 响应日志 */
export class LogResInterceptor implements Interceptor {
  static _ins: LogResInterceptor;
  type = InterceptorType.RESPONSE;

  async interceptor(res: IInterceptorData) {
    const config = res.config;

    console.log(
      `%c 响应日志: %c${config.label ? `【${config.label}】` : ""}`,
      "background:green;padding:2px 4px;color:#fff;font-weight:600",
      null,
      res
    );

    return res;
  }

  static get instance() {
    if (!this._ins) {
      this._ins = new LogResInterceptor();
    }
    return this._ins;
  }
}
