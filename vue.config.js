const path = require("path");
const webpack = require("webpack");
const isProd = process.env.NODE_ENV === "production";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: process.env.VUE_APP_BASE,
  lintOnSave: false,
  runtimeCompiler: true, // 使用构建版vue
  transpileDependencies: ['/node_modules/fvc'],
  css: {
    // 配置css模块
    loaderOptions: {
      // 向预处理器 Loader 传递配置选项
      less: {
        // 配置less（其他样式解析用法一致）
        javascriptEnabled: true // 设置为true
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      "/api/": {
        target: "http://202.121.179.38:9000/",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
        ws: true
      },
      "/ide/": {
        target: "http://ide.joyoj.org/",
        pathRewrite: { "^/ide": "" },
        changeOrigin: true,
        ws: true
      }
    }
  },
  configureWebpack: config => {
    config.externals = {
      jquery: "jQuery",
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      iview: "iview", //iview
      echarts: "echarts"
    };

    const plugins = [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      }),
      new webpack.DefinePlugin({
        "process.env": {
          VERSION: JSON.stringify(require("./package.json").version),
          NAME: JSON.stringify(require("./package.json").name)
        }
      })
      // new BundleAnalyzerPlugin()
    ];

    if (process.env.VUE_APP_ENV == "production") {
      plugins.push(
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require("./public/vendor/vendor-manifest.json")
        })
      );
    }

    return {
      plugins
    };
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.entry.app = ["babel-polyfill", resolve("src/main.js")];
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  }
};
