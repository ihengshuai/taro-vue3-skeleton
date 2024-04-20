import { createApp } from "vue";
import { createPinia } from "pinia";

import "./app.less";
import { useConfig } from "./config";

const App = createApp({
  // @ts-ignore
  onShow(opts: any) {
    console.log("show...");
  },
  onLaunch() {
    console.log("launch...");
  },
  setup() {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

App.use(createPinia());

console.log(useConfig());

export default App;
