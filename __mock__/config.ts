// 全局共享配置
export const GlobalConfiguration = () => ({
  __is_Prod__: process.env.NODE_ENV === "production",
  __is_Dev__: process.env.NODE_ENV !== "production",
  __isHttps__: process.env.SSL_CERTIFICATE && process.env.SSL_CERTIFICATE_KEY,
  NODE_ENV: process.env.NODE_ENV?.length ? process.env.NODE_ENV : "development",
  PORT: (process.env.MOCK_PORT || 5000) as number,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? "localhost",
  COOKIE_LANG_KEY: process.env.COOKIE_LANG_KEY ?? "__lang",
  DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE ?? "en",
  // 客户端编译目录
  CLIENT_DIR: process.env.CLIENT_OUTDIR || "dist/client",
  // 证书
  SSL_CERTIFICATE: process.env.SSL_CERTIFICATE,
  SSL_CERTIFICATE_KEY: process.env.SSL_CERTIFICATE_KEY,
});
