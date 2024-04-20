/**
 * 全局数据globalData
 * 使用pinia状态管理也可以，本意都是全局变量
 */

import type { IGlobalAppDataOpts } from "@/typings/common/app-data";
import { deepMerge } from "@/utils";
import { ref, toRaw } from "vue";

const globalAppData = ref<IGlobalAppDataOpts>({});
export function useGlobalAppData() {
  // 全局初始化数据占位
  // 需要的数据需定义到app-data.d.ts中
  setGlobaApplData({
    appTitle: "uni-app",
    author: {
      name: "ihengshuai",
    },
  });

  function setGlobaApplData(data: IGlobalAppDataOpts) {
    const rawData = toRaw(globalAppData.value);
    const newData = deepMerge(rawData, data);
    Object.assign(globalAppData.value, newData);
  }

  return {
    globalAppData,
    setGlobaApplData,
  };
}
