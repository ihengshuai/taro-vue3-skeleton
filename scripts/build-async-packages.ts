/**
 * 构建异步分包
 * 由于uniapp对异步分包的支持有问题，顾自定义脚本来打包
 */

import { build } from "esbuild";
import fs from "fs";
import { cwd } from "process";
import path from "path";
import chokidar from "chokidar";

const resolvePath = p => path.resolve(cwd(), p);
const __isDev__ = process.env.NODE_ENV === "development";
const platform = process.env.TARO_ENV || "weapp";

async function buildPackage(packageName) {
  await build({
    entryPoints: [`src/packages/${packageName}/index.ts`],
    bundle: true,
    outfile: `dist/${platform}/package-${packageName}/index.js`,
    format: "cjs",
    drop: !__isDev__ ? ["console", "debugger"] : [],
    minify: !__isDev__,
  });
}

async function bundleQueue(purePackages, buildIdx = 0) {
  if (buildIdx >= purePackages.length) {
    return;
  }
  await buildPackage(purePackages[buildIdx]);
  bundleQueue(purePackages, buildIdx + 1);
}

async function bootstrap() {
  try {
    console.log("正在处理异步分包...");
    const asyncPackages = await fs.readdirSync(resolvePath("src/packages"));
    await bundleQueue(asyncPackages, 0);
    const buildPageJSON = await fs.readFileSync(resolvePath(`dist/${platform}/app.json`), "utf-8");
    const buildPageConfig = JSON.parse(buildPageJSON);
    buildPageConfig["resolveAlias"] = {
      ...buildPageConfig["resolveAlias"],
      "~/*": "/*",
    };
    buildPageConfig.subPackages = buildPageConfig.subPackages || [];
    const subPackageNames = buildPageConfig.subPackages.map(l => l.root);

    buildPageConfig.subPackages.unshift(
      ...asyncPackages.map(p => ({ root: `package-${p}`, pages: [] })).filter(l => !subPackageNames.includes(l.root))
    );
    await fs.writeFileSync(resolvePath(`dist/${platform}/app.json`), JSON.stringify(buildPageConfig));
    console.log("done.\n");
  } catch (error) {
    throw error;
  }
}

try {
  bootstrap();
  if (__isDev__) {
    const watch = chokidar.watch("src/packages/**/*.ts", { persistent: true /**ignored: /?=ts$/i */ });
    watch.on("change", async p => {
      await bootstrap();
    });
  }
} catch (err) {
  console.error(err);
  process.exit(0);
}
