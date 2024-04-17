import { HTTP_DATA_TYPE, InterceptorType } from "@/constants/http";
import Taro from "@tarojs/taro";
import { AxiosRequestConfig } from "axios";

export abstract class Interceptor {
  static _ins: Interceptor;
  abstract type: InterceptorType;
  abstract interceptor(res: IInterceptorData | unknown): Promise<any>;
  static instance: Interceptor;
}

export interface IHttpError {
  code?: number;
  message: string;
  config?: IHttpRequestConfig;
  response?: any;
  /** 用来区分是否业务错误 */
  isBusinessError?: boolean;
}

export interface IInterceptorData {
  /**
   * 配置
   */
  config: IHttpRequestConfig;
  /**
   * 后端返回的真实载体
   */
  data: {
    statusCode: number;
    payload: {
      /**
       * 后端状态码
       */
      code: number;
      /**
       * 有效数据
       */
      data: any;
      /**
       * 消息信息
       */
      message?: string;
      /**
       * 错误信息
       */
      error?: string;
    };
  };
}

// https://docs.taro.zone/docs/apis/network/request/
/** 小程序taro请求参数 */
export interface IMiniProgramRequestConfig {
  /** 响应的数据类型 */
  responseType?: keyof ResponseType;
  /** 开启 http2
   * @default false
   * @supported weapp
   */
  enableHttp2?: boolean;
  /** 开启 quic
   * @default false
   * @supported weapp
   */
  enableQuic?: boolean;
  /** 开启 cache
   * @default false
   * @supported weapp, tt
   */
  enableCache?: boolean;
  /** 是否开启 HttpDNS 服务。如开启，需要同时填入 httpDNSServiceId 。 HttpDNS 用法详见 移动解析HttpDNS
   * @default false
   * @supported weapp
   */
  enableHttpDNS?: boolean;
  /** HttpDNS 服务商 Id。 HttpDNS 用法详见 移动解析HttpDNS
   * @supported weapp
   */
  httpDNSServiceId?: string;
  /** 开启 transfer-encoding chunked。
   * @default false
   * @supported weapp
   */
  enableChunked?: boolean;
  /**
   * wifi下使用移动网络发送请求
   * @default false
   * @supported weapp
   */
  forceCellularNetwork?: boolean;
  /**
   * headers 中设置 cookie 字段是否生效。如果为 false，则 headers 中的 cookie 字段将被忽略，请求头中将包含服务端上一次返回的 cookie（如果有）。
   * @default false
   * @supported alipay 支付宝: 10.2.33+
   */
  enableCookie?: boolean;
}

interface IUploadFileOptionFiles {
  /**
   * multipart 提交时，表单的项目名，默认为 file，如果 name 不填或填的值相同，可能导致服务端读取文件时只能读取到一个文件。
   */
  name?: string;
  /**
   * 要上传的文件对象
   */
  file?: File;
  /**
   * 要上传文件资源的路径
   */
  uri?: string;
}

export interface IHttpUploadRequestConfig {
  /**
   * 开发者服务器 url
   */
  url: string;
  /**
   * 文件类型，image/video/audio，仅支付宝小程序，且必填。
   * - image: 图像
   * - video: 视频
   * - audio: 音频
   */
  fileType?: "image" | "video" | "audio";
  /**
   * 要上传的文件对象
   */
  file?: File;
  /**
   * 要上传文件资源的路径
   */
  filePath?: string;
  /**
   * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
   */
  name?: string;
  /**
   * 需要上传的文件列表。
   */
  files?: IUploadFileOptionFiles[];
}

// @ts-ignore
export interface IHttpRequestConfig extends AxiosRequestConfig, IMiniProgramRequestConfig, IHttpUploadRequestConfig {
  /** 以叉桩形式拼接地址 */
  urlPath?: Record<string, string | number | boolean | undefined | null>;
  /** 数据类型 */
  serializeType?: HTTP_DATA_TYPE;
  /**
   * 重试次数
   * @default 0
   */
  retryCount?: number;
  /**
   * 重试间隔
   * @default 1000
   */
  retryInterval?: number;
  /**
   * 开启全局错误捕获
   * @default true
   */
  captureError?: boolean;
  /**
   * 忽略取消请求
   * @default false
   */
  ignoreCancelToken?: boolean;
  /**
   * 是否开启时间戳(get缓存问题)
   * @default false
   * @method get
   */
  timeStamp?: boolean;
  /**
   * 是否转换相应数据为驼峰
   * @default true
   */
  transferToCamel?: boolean;
  /**
   * 绑定当前请求参数配置（仅内部使用）
   */
  $request?: IHttpRequestConfig;
  signal?: ReturnType<typeof Taro.request>;

  /**
   * 请求标识，方便日志查询
   */
  label?: string;

  /**
   * 自定义业务状态判断逻辑
   * @param res 响应数据
   * @default res.data.payload.code >= 300 表示错误
   * @description payload 为后端返回的数据，具体根据后端进行调整
   */
  customBusinessStatusHook?: (res: IInterceptorData) => boolean;
}

declare module "axios" {
  interface AxiosRequestConfig {
    $request?: IHttpRequestConfig;
  }

  interface InternalAxiosRequestConfig extends IHttpRequestConfig {}
}
