const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    vendor: [
      "store",
      "unfetch",
      "vue-bem-cn",
      "vue-gemini-scrollbar"
    ]
  },
  output: {
    path: path.join(__dirname, "public/vendor"),
    filename: "[name].dll.js",
    library: "[name]_[hash]" // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "public/vendor", "[name]-manifest.json"),
      name: "[name]_[hash]",
      context: process.cwd()
    })
  ]
};
