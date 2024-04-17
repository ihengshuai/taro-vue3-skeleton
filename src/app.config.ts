export default defineAppConfig({
  pages: ["pages/home/index"],
  window: {
    backgroundTextStyle: "@mode",
    navigationBarBackgroundColor: "@navBgColor",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "@navTextColor",
    backgroundColor: "@backgroundColor",
  },
  darkmode: true,
  themeLocation: "theme.json",
  // tabBar: {
  //   selectedColor: "#ff4400",
  //   backgroundColor: "@tabBgColor",
  //   list: [
  //     {
  //       pagePath: "pages/index/index",
  //       text: "首页",
  //     },
  //     {
  //       pagePath: "pages/me/index",
  //       text: "我的",
  //     },
  //   ],
  // },
});
