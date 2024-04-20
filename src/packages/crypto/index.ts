import md5 from "crypto-js/md5";

export function MD5(str: string) {
  return md5(str).toString();
}
