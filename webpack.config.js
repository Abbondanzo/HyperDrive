const crypto = require("crypto");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDevelopment = process.env.NODE_ENV === "development";

const stats = {
  assetsSort: "chunks",
  entrypoints: false,
  excludeAssets: /\.map$/,
  colors: true,
  version: false,
  hash: false,
  timings: false,
  cached: false,
  cachedAssets: false,
  chunkModules: false,
  chunks: false,
  entrypoints: false,
  modules: false,
};

// If we have collisions, I'll eat my socks
const hashCode = (value) => {
  return crypto.createHash("md5").update(value).digest("hex").slice(0, 12);
};

const mode = isDevelopment ? "development" : "production";
console.log(`Running webpack in ${mode} mode`);
console.log("Your CPU fan sounds kinda quiet. Lemme fix that...\n");

module.exports = {
  mode,
  devtool: "source-map",

  stats,

  devServer: {
    publicPath: "/",
    port: 3000,
    hot: true,
    inline: true,
    contentBase: path.join(__dirname, "public"),
    stats,
  },

  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },

  output: {
    pathinfo: true,
    filename: "static/js/[name].js",
    sourceMapFilename: "static/maps/[file].map[query]",
    chunkFilename: "static/js/[name].chunk.js",
    globalObject: "this",
  },

  optimization: {
    minimize: !isDevelopment,
    splitChunks: {
      chunks: "all",
      name(_module, chunks, cacheGroupKey) {
        const hashChunks = hashCode(chunks.join("-"));
        return `${cacheGroupKey}-${hashChunks}`;
      },
    },
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "node_modules")],
  },

  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      { test: /\.(glsl)$/, use: "raw-loader" },
    ],
  },

  plugins: [
    !isDevelopment &&
      new CopyWebpackPlugin({
        patterns: [{ from: "public" }],
      }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ].filter(Boolean),
};
