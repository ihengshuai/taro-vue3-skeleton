import type { IHttpRequestConfig } from "@/typings/common/http";
import { HttpClient } from "./base";
import { HTTP_METHOD } from "@/constants/http";

export class HttpClientFile extends HttpClient {
  private static _uploadInstance: Uni["uploadFile"];
  private static _downloadInstance: Uni["downloadFile"];

  static get createInstance() {
    return new HttpClientFile();
  }

  static get uploadInstance() {
    if (!this._uploadInstance) {
      this._uploadInstance = uni.uploadFile;
    }
    return this._uploadInstance;
  }

  static get downloadInstance() {
    if (!this._downloadInstance) {
      this._downloadInstance = uni.downloadFile;
    }
    return this._downloadInstance;
  }

  async upload<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    request = request || {};
    const requestConfig = this.getRequestConfig(HTTP_METHOD.POST, request);
    return new Promise<any>((resolve, reject) => {
      const requestPayload = {
        ...(requestConfig as any),
        header: requestConfig.headers,
      } as Parameters<Uni["request"]>;

      HttpClientFile.uploadInstance({
        url: requestConfig.url!,
        ...requestPayload,
        success(result) {
          resolve(result);
        },
        fail(result) {
          reject(result);
        },
      });
    });
  }

  async download<T = any>(url: string, request?: IHttpRequestConfig): Promise<T> {
    request = request || {};
    const requestConfig = this.getRequestConfig(HTTP_METHOD.GET, request);
    return new Promise<any>((resolve, reject) => {
      const requestPayload = {
        ...(requestConfig as any),
        header: requestConfig.headers,
      } as Parameters<Uni["request"]>;

      HttpClientFile.downloadInstance({
        url: requestConfig.url!,
        ...requestPayload,
        success(result) {
          resolve(result);
        },
        fail(result) {
          reject(result);
        },
      });
    });
  }
}
