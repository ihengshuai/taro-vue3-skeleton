/**
 * 由于taro3对异步分包支持有问题，项目中自定义脚本来编译异步分包
 * 使用异步分包可以很好的解决小程序每个包太大的问题
 * 但还是不能越过总体积超过20M的显示
 * 使用异步分包后需使用异步加载的方式进行包的加载使用
 * require("~/pure-moment-lib/index.js").then(res => {
 *    // res为模块对象，default属性可以拿到目标
 *    res.default().format("YYYY-MM-DD HH:mm:ss"))
 * })
 *
 * 更多详情参考官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/async.html
 */

const { spawn } = require("child_process");

const PLATFORM = process.env.TARO_ENV || "weapp";

module.exports = class BuildAsyncPackagePlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("BuildAsyncPackagePlugin", () => {
      // 非小程序环境不需要执行异步分包脚本
      if (!/^(weapp|alipay)/i.test(PLATFORM)) return;
      spawn("esno", ["scripts/build-async-packages.ts"], {
        stdio: "inherit",
        shell: true,
      });
    });
  }
};
