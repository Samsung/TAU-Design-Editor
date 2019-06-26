/* eslint-env mode, es6 */
/* global module, __dirname */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {createVSCAliasObject, CONTEXT} = require('./webpack-utils');
const OUTPUT = path.resolve(CONTEXT, 'dist/vsc');
const plugins = [
	new CopyWebpackPlugin([
		{
			from: path.resolve(CONTEXT, 'vsc'),
			to: path.resolve(OUTPUT, 'design-editor/vsc')
		},
		{
			from: path.resolve(CONTEXT, 'vsc-extension')
		},
		{
			from: path.resolve(CONTEXT, 'design-editor/src'),
			to: path.resolve(OUTPUT, 'design-editor/closet')
		},
		{
			from: path.resolve(CONTEXT, 'tau-component-packages/libs/tau/wearable/theme/default'),
			to: path.resolve(OUTPUT, 'design-editor/closet/templates')
		},
		{
			from: path.resolve(CONTEXT, 'closet-default-component-packages'),
			to: path.resolve(
				OUTPUT,
				'design-editor/node_modules/closet-default-component-packages'
			)
		},
		{
			from: path.resolve(CONTEXT, 'closet-component-packages'),
			to: path.resolve(
				OUTPUT,
				'design-editor/node_modules/closet-component-packages'
			)
		},
		{
			from: path.resolve(CONTEXT, 'tau-component-packages'),
			to: path.resolve(
				OUTPUT,
				'design-editor/node_modules/tau-component-packages'
			)
		},
		{
			from: path.resolve(CONTEXT, 'content-manager'),
			to: path.resolve(
				OUTPUT,
				'design-editor/node_modules/content-manager'
			)
		},
		{
			from: path.resolve(CONTEXT, 'design-editor/styles'),
			to: path.resolve(OUTPUT, 'design-editor/styles')
		}
	])
];

const production = {
	name: 'production',
	context: CONTEXT,
	node: {
		__filename: true,
		__dirname: true
	},
	entry: path.resolve(CONTEXT, 'design-editor/src/vsc/vsc-editor.js'),
	output: {
		path: OUTPUT,
		filename: 'design-editor/design-editor.bundle.js'
	},
	target: 'web',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|css|graceful-fs)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'css-loader'
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{loader: 'less-loader'}
				]
			}
		]
	},
	resolve: {
		alias: createVSCAliasObject
	},
	plugins: plugins
};

const development = {
	name: 'development',
	context: CONTEXT,
	node: {
		__filename: true,
		__dirname: true
	},
	entry: path.resolve(CONTEXT, 'design-editor/src/vsc/vsc-editor.js'),
	output: {
		path: OUTPUT,
		filename: 'design-editor/design-editor.bundle.js'
	},
	optimization: {
		minimize: false,
		namedModules: true,
		namedChunks: true
	},
	target: 'web',
	devtool: 'inline-source-map',
	stats: 'errors-only',
	performance: {
		hints: false
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|css|graceful-fs)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							compact: false,
							comments: true
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'css-loader'
					}
				]
			},
			{
				test: /\.less$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{loader: 'less-loader'}
				]
			}
		]
	},
	resolve: {
		alias: createVSCAliasObject
	},
	plugins: plugins
};

module.exports = [development, production];
