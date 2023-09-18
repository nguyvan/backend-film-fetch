const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
	target: "node",
	entry: "./src/index.ts",
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: [
					/node_modules/,
					path.resolve(__dirname, "./src/scripts/**/*"),
				],
				include: [path.resolve(__dirname, "src")],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
};
