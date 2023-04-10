const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      // '/api' 自行设置的请求前缀
      "/api": {
        // 请求的服务器 URL
        target: "http://gmall-h5-api.atguigu.cn",
        //用于重写路径：正则匹配以'/api'开头的路径，将'/api'设置为''之后再发送请求给服务器
        // 因为目前访问的服务器接口都是以'/api'开头，所以不需要重写路径
        // pathRewrite: { "^/api": "" },
        ws: true, //用于支持websocked
        changeOrigin: true, //用于控制请求头中的host值，true表示代理服务器host值和服务器相同
      },
    },
  },
  configureWebpack: (config) => {
    const plugins = [];
    plugins.push(new NodePolyfillPlugin());
  },
});
