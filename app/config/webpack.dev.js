const path = require('path');
const webpack = require('webpack');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
	entry: {
		main: [
			'babel-runtime/regenerator',
			'webpack-hot-middleware/client?reload=true',
		],
	},
	mode: 'development',
	output: {
		filename: '[name]-bundle.js',
		path: path.resolve(__dirname, '../../dist'),
		publicPath: '/',
	},
	devServer: {
		contentBase: 'dist',
		hot: true,
		open: true,
		progress: true,
		stats: {
			colors: true,
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	resolve: {
		extensions: ['.js'],
	},
};
