const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(
      "/apc", {
        target: "https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com/", // 目标路径
        changeOrigin: true,
        pathRewrite: {
          "^/apc": ""
        }
      }
    ),
    createProxyMiddleware(
      "/api", {
        target: "https://api.weixin.qq.com/", // 目标路径
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      },
    ),
    
  )
}

