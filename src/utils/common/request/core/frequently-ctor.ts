import type { IHttpError, IHttpRequestConfig, Interceptor } from "@/typings/common/http";
import type { Method } from "axios";
import { HttpClient } from "./base";
import { CancelToken } from "../cancel-token";
import { HTTP_METHOD, InterceptorType, WRONG_MESSAGE } from "@/constants/http";
import {
  runInterceptors,
  BeautifyResInterceptor,
  LogResInterceptor,
  NecessaryResInterceptor,
  NecessaryReqInterceptor,
  NecessaryErrorInterceptor,
  LogReqInterceptor,
} from "../interceptor";

export class HttpClientFrequently extends HttpClient {
  private static _instance: HttpClientFrequently;
  private static _requestInstance: Uni["request"];

  private static _interceptors: Interceptor[] = [];

  static get instance(): HttpClientFrequently {
    if (!this._instance) {
      this._instance = new HttpClientFrequently();
    }
    return this._instance;
  }

  static get createInstance() {
    return new HttpClientFrequently();
  }

  static get requestInstance() {
    if (!this._requestInstance) {
      this._requestInstance = uni.request;
    }
    return this._requestInstance;
  }

  static useInterceptors(...interceptors: (typeof Interceptor)[]) {
    HttpClientFrequently._interceptors.push(...interceptors.map(l => l.instance));
  }

  private static get responseInterceptors() {
    return HttpClientFrequently._interceptors.filter(interceptor => interceptor.type === InterceptorType.RESPONSE);
  }

  private static get requestInterceptors() {
    return HttpClientFrequently._interceptors.filter(interceptor => interceptor.type === InterceptorType.REQUEST);
  }

  private static get errorInterceptors() {
    return HttpClientFrequently._interceptors.filter(interceptor => interceptor.type === InterceptorType.ERROR);
  }

  async get<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>(HTTP_METHOD.GET, { url, ...request });
  }

  async post<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>(HTTP_METHOD.POST, { url, ...request });
  }

  async delete<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>(HTTP_METHOD.DELETE, { url, ...request });
  }

  async put<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>(HTTP_METHOD.PUT, { url, ...request });
  }

  async head<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>(HTTP_METHOD.HEAD, { url, ...request });
  }
  async patch<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    return this.request<T>(HTTP_METHOD.PATCH, { url, ...request });
  }

  public async request<T>(method: Method, request: IHttpRequestConfig): Promise<T> {
    request = request || {};
    request.method = method;

    return this.send(
      await runInterceptors<IHttpRequestConfig>(
        HttpClientFrequently.requestInterceptors,
        this.getRequestConfig(method, request)
      )
    );
  }

  private async send<T>(requestConfig: IHttpRequestConfig): Promise<T> {
    if (requestConfig.ignoreCancelToken !== true) {
      CancelToken.instance.cancel(requestConfig);
    }
    return new Promise<any>((resolve, reject) => {
      const requestPayload = {
        ...(requestConfig as any),
        header: requestConfig.headers,
      } as Parameters<Uni["request"]>;

      const requestTask = HttpClientFrequently.requestInstance({
        url: requestConfig.url!,
        ...requestPayload,
        success(result) {
          const responseData = {
            config: requestConfig,
            data: {
              ...result,
              payload: result.data,
            },
          };
          runInterceptors(HttpClientFrequently.responseInterceptors, responseData)
            .then(resolve)
            .catch(async err => {
              try {
                await runInterceptors(HttpClientFrequently.errorInterceptors, err);
              } catch (error) {
                reject(error);
              }
            });
        },
        fail: async err => {
          if (err && err.errMsg === WRONG_MESSAGE.ABORT) return err;

          const request = requestConfig.$request!;
          if (request?.retryCount && request.retryCount > 0) {
            setTimeout(() => {
              request.retryCount && request.retryCount--;
              this.send(requestConfig).then(resolve).catch(reject);
            }, request.retryInterval);
          } else {
            try {
              const error = new Error(err.errMsg || "请求失败...") as IHttpError;
              error.code = 500;
              error.config = requestConfig;
              error.response = err;
              error.isBusinessError = false;

              await runInterceptors(HttpClientFrequently.errorInterceptors, error);
            } catch (error) {
              reject(error);
            }
          }
        },
      });

      requestConfig.signal = requestTask;
      CancelToken.instance.register(requestConfig);
    });
  }
}

HttpClientFrequently.useInterceptors(NecessaryReqInterceptor, LogReqInterceptor);
HttpClientFrequently.useInterceptors(NecessaryResInterceptor, LogResInterceptor, BeautifyResInterceptor);
HttpClientFrequently.useInterceptors(NecessaryErrorInterceptor);
