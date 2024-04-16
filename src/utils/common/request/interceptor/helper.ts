import type { Interceptor, IInterceptorData } from "@/typings/common/http";

/** 执行拦截器工具 */
export async function runInterceptors<T = IInterceptorData>(interceptors: Interceptor[], initData: T) {
  const len = interceptors.length;
  if (len === 0) return initData;
  return interceptors.reduce(
    (p, c) => p.then(res => c.interceptor(res)).catch(err => Promise.reject(err)),
    Promise.resolve(initData)
  );
}
