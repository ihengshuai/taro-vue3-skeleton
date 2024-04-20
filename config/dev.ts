import { defineConfig } from "@tarojs/cli";

module.exports = defineConfig({
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  // outputRoot: "dist" + process.env.,
  mini: {
    // webpackChain: chain => {},
  },
  h5: {
    webpack: {
      devServer: {
        open: false,
      },
    },
  },
});
