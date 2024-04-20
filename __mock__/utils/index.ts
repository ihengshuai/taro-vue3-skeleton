import * as dayjs from "dayjs";

export function say() {
  console.log("say hello");
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | number | string, format = "YYYY/MM/DD HH:mm:ss") {
  return dayjs(date).format(format);
}

/**
 * 随机生成由 日期和随机数 组合的字符
 */
export function generateRandomNameByDate() {
  return +new Date() + "_" + Math.floor(Math.random() * 897656);
}
