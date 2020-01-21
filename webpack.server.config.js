const path = require("path");

// Maybe I dont need this 

module.exports = {
  mode: "development",
  target: "node",
  devtool: 'inline-source-map',
  entry: {
    server: ["./server/index.ts"],
  },
  resolve: {
    extensions: ['.ts', '.js' ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
            configFile: "tsconfig.server.json",
        },
      }
    ]
  },
}
