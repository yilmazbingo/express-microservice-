const path = require("path");

module.exports = {
  mode: "development",
  entry: ["regenerator-runtime/runtime", "./index.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main-bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [{ test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ }],
  },
  devtool: "eval-cheap-source-map",
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "public"),
  },
};
