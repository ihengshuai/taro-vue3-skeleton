/**
 * 定义全局app globalData 数据类型
 */
export interface IGlobalAppDataOpts {
  /**
   * app标题
   */
  appTitle?: string;

  /** app版本 */
  appVersion?: string;

  author?: {
    name?: string;
    age?: number;
  };

  description?: string;
}
