import { InterceptorType, WRONG_MESSAGE } from "@/constants/http";
import type { IHttpError, Interceptor } from "@/typings/common/http";
import { trimStrSpace } from "@/utils";
import { HttpStatusCode } from "axios";
import Taro from "@tarojs/taro";

/** 错误处理拦截器 */
export class NecessaryErrorInterceptor implements Interceptor {
  static _ins: NecessaryErrorInterceptor;

  type: InterceptorType = InterceptorType.ERROR;

  async interceptor(err: IHttpError): Promise<any> {
    const config = err.config;
    const errorMessage = trimStrSpace(err.message);

    // 非业务错误
    if (!err.isBusinessError) {
      let message = "请求失败";
      if (errorMessage === WRONG_MESSAGE.FAIL) {
        message = "请求失败";
      } else if (errorMessage === WRONG_MESSAGE.TIMEOUT) {
        message = "请求超时";
      } else if (err.code === HttpStatusCode.NotFound) {
        message = "请求地址不存在";
      }
      if (config?.captureError !== false) {
        Taro.showToast({
          title: message,
          icon: "none",
        });
      }
    } /* 业务错误 */ else {
      if (config?.captureError !== false) {
        Taro.showToast({
          title: err.message,
          icon: "none",
        });
      }
    }

    console.log(
      `%c 错误日志: %c${config?.label ? `【${config.label}】` : ""}`,
      "background:red;padding:2px 4px;color:#fff;font-weight:600",
      null,
      err.code,
      err.message,
      err
    );

    return Promise.reject(err);
  }

  static get instance() {
    if (!this._ins) {
      this._ins = new NecessaryErrorInterceptor();
    }
    return this._ins;
  }
}
