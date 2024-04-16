import type { DeepMerge } from "@/typings/common/type";
import { isObject } from "@hengshuai/helper";

/**
 * 日志
 */
export class Logger {
  static log(...args: any) {
    console.log("%c LogInfo %c", "background:rgba(255, 255, 255, 0.4);color:#fff", null, ...args);
  }

  static warn(...args: any) {
    console.log("%c LogWarn %c", "background:#a77f31;color:#ececec", null, ...args);
  }
}

// 延时
export function sleep(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms || 10));
}

/**
 * 下划线转换驼峰
 */
export function snakeToCamel(data: Record<string, any> | any[] | string): any {
  if (data) {
    if (typeof data === "string") {
      return data.replace(/_([^_])/gi, (_$0, $1) => $1.toUpperCase());
    } else if (typeof data === "number" || typeof data === "boolean") {
      return data;
    } else {
      const res: any = data.constructor === Array ? [] : {};
      for (const key in data) {
        // @ts-ignore
        const value = data[key];
        res[snakeToCamel(key) as string] = typeof value !== "object" || value === null ? value : snakeToCamel(value);
      }
      return res;
    }
  }
  return data;
}

/**
 * 去除字符串空格
 * @param str 目标字符
 * @param type 去除类型
 */
export function trimStrSpace(str: string, type: "all" | "side" | "left" | "right" = "side") {
  if (type === "all") {
    return str.replace(/\s+/g, "");
  } else if (type === "left") {
    return str.replace(/(^\s*)/g, "");
  } else if (type === "right") {
    return str.replace(/(\s*$)/g, "");
  }
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 深度遍历两个对象，将后者值覆盖前者
 */
export function deepMerge<T, U>(target: T, source: U): DeepMerge<T, U> {
  if (isObject(target) && isObject(source)) {
    const merged: any = { ...target };

    for (const key in source) {
      if (isObject(source[key])) {
        // @ts-ignore
        merged[key] = deepMerge(target[key as any], source[key]);
      } else {
        merged[key] = source[key];
      }
    }

    return merged;
  }

  return source as DeepMerge<T, U>;
}
