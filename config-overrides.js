const webpack = require("webpack");
const path = require("path");

module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser.js"),
    path: require.resolve("path-browserify"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser.js",
    }),
  ]);

  // Add .mjs support for strict ESM packages (like Reown)
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
