export default defineAppConfig({
  pages: ["pages/main/home/index", "pages/main/discover/index", "pages/main/me/index"],
  subPackages: [
    {
      root: "pages-h5",
      pages: ["pages/home/index"],
    },
    {
      root: "pages-blog",
      pages: ["index"],
    },
  ],
  window: {
    backgroundTextStyle: "@mode",
    navigationBarBackgroundColor: "@navBgColor",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "@navTextColor",
    backgroundColor: "@backgroundColor",
  },
  darkmode: true,
  themeLocation: "theme.json",
  tabBar: {
    selectedColor: "#ff4400",
    backgroundColor: "@tabBgColor",
    list: [
      {
        pagePath: "pages/main/home/index",
        text: "首页",
      },
      {
        pagePath: "pages/main/discover/index",
        text: "发现",
      },
      {
        pagePath: "pages/main/me/index",
        text: "我的",
      },
    ],
  },
});
