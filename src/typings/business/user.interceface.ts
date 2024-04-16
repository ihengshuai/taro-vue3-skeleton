/**
 * 定义用户相关的接口
 */

import type { USER_SEX } from "@/constants/user";

/** 用户信息 */
export interface IUserInfo {
  userName: string | null;
  userAge: number | null;
  userSex: USER_SEX | null;
}
