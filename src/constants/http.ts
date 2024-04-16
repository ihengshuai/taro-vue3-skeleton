export enum HTTP_DATA_TYPE {
  FORM = "form",
  JSON = "json",
  FORMDATA = "form-data",
}

/** 并发状态 */
export enum CONCURRENCY_STATUS {
  PENDING = "pending",
  END = "end",
}

/** 异常状态枚举 */
export enum WRONG_MESSAGE {
  /** 请求被取消 */
  ABORT = "request:fail abort",
  /** 请求失败 */
  FAIL = "request:fail",
  /** 请求超时 */
  TIMEOUT = "request:fail timeout",
}

/** HTTP方法 */
export enum HTTP_METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  HEAD = "head",
  OPTIONS = "options",
  PATCH = "patch",
  PURGE = "purge",
  LINK = "link",
  UNLINK = "unlink",
}

/** 拦截器类型 */
export enum InterceptorType {
  RESPONSE = "response",
  REQUEST = "request",
  ERROR = "error",
}
