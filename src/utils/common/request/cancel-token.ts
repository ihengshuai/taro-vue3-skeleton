import type { IHttpRequestConfig } from "@/typings/common/http";

export class CancelToken {
  private static _instance: CancelToken;
  private _tokenStorage: Map<string, AbortController | UniApp.RequestTask>;

  constructor() {
    this._tokenStorage = new Map();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new CancelToken();
    }
    return this._instance;
  }

  register(config: IHttpRequestConfig) {
    this.cancel(config);
    config.signal = config.signal! || new AbortController();
    const key = this.getTokenKey(config);
    if (this._tokenStorage.has(key)) return;
    this._tokenStorage.set(key, config.signal!);
  }

  cancel(config: IHttpRequestConfig) {
    const key = this.getTokenKey(config);
    const ctor = this._tokenStorage.get(key);
    if (ctor) {
      ctor.abort();
    }
    this._tokenStorage.delete(key);
  }

  clear() {
    for (const [, ctor] of this._tokenStorage.entries()) {
      ctor.abort();
    }
    this._tokenStorage.clear();
  }

  private getTokenKey(config: IHttpRequestConfig): string {
    return `${config.method}-${config.url}`;
  }
}
