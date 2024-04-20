import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "@tarojs/cli";
import webpack from "webpack";
import { spawn } from "child_process";

const __isDev__ = process.env.NODE_ENV === "development";
const rootDir = process.cwd();
const resolvePath = (p = "") => path.resolve(rootDir, p);
const platform = process.env.TARO_ENV;

const parsedConfig =
  dotenv.config({
    path: __isDev__ ? resolvePath(".env") : resolvePath(".env.production"),
    override: true,
  })?.parsed || ({} as any);

if (__isDev__ && parsedConfig.USE_MOCK === "true") {
  try {
    spawn("pnpm", ["run", "mock"], {
      stdio: "inherit",
      shell: true,
    });
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
}

const ENV_VARS = {
  NODE_ENV: JSON.stringify(parsedConfig.NODE_ENV || "development"),
  BASE_URL: JSON.stringify(parsedConfig.BASE_URL),
  TIMEOUT: JSON.stringify(parsedConfig.TIMEOUT),
  USE_MOCK: JSON.stringify(parsedConfig.USE_MOCK),
  MOCK_API: JSON.stringify(parsedConfig.MOCK_API),
  COOKIE_DOMAIN: JSON.stringify(parsedConfig.COOKIE_DOMAIN),
  API_DOMAIN: JSON.stringify(parsedConfig.API_DOMAIN),
  APP_ID: JSON.stringify(parsedConfig.APP_ID || ""),
};

const config = defineConfig({
  projectName: "taro-study",
  date: "2024-2-18",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: `dist/${platform}`,
  plugins: [],
  defineConstants: {
    VERSION: "'1.0.0'",
  },
  alias: {
    "@": resolvePath("src"),
  },
  copy: {
    patterns: [],
    options: {},
  },
  framework: "vue3",
  compiler: "webpack5",
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    webpackChain(chain) {
      chain.plugin("DefinePlugin").use(new webpack.DefinePlugin(ENV_VARS));
      chain.merge({
        module: {
          rule: {
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve("babel-loader"),
                },
              },
            },
          },
        },
      });
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    webpackChain: chain => {
      chain.plugin("DefinePlugin").use(new webpack.DefinePlugin(ENV_VARS));
    },
  },
});

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
