/* global module, __dirname */
const path = require('path');
const webpack = require('webpack');

const serverConfig = {
	context: path.resolve(__dirname),
	entry: './src/tcomm-server.js',
	output: {
		library: 'TComm',
		libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist'),
		filename: 'server.js'
	},
	target: 'node',
	devtool: 'inline-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['babel-preset-env']
					}
				}
			}
		]
	}
}

const clientConfig = {
	context: path.resolve(__dirname),
	entry: './src/tcomm-client.js',
	output: {
		library: 'TComm',
		libraryTarget: 'umd',
		path: path.resolve(__dirname, 'dist'),
		filename: 'client.js'
	},
	target: 'web',
	devtool: 'inline-source-map',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['babel-preset-env']
					}
				}
			}
		]
	}
}

module.exports = [serverConfig, clientConfig];
