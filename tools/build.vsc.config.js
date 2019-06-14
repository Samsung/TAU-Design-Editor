/* eslint-env mode, es6 */
/* global module, __dirname */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CONTEXT = path.resolve(__dirname, '..');
const {createAliasObject} = require('./webpack-utils')(CONTEXT);
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

const relativeAliases = [
	['fs', 'vsc-extension/design-editor/libs/fs.js'],
	['labels', 'vsc-extension/design-editor/labels.js'],
	['fs-extra', 'vsc-extension/design-editor/libs/fs-extra.js'],
	['atom', 'vsc-extension/design-editor/libs/atom.js'],
	['brackets', 'vsc-extension/design-editor/libs/brackets.js'],
	['remote', 'design-editor/libs/remote.js'],
	['closet-default-component-packages', 'closet-default-component-packages'],
	['closet-component-packages', 'closet-component-packages'],
	['tau-component-packages', 'tau-component-packages'],
	['content-manager', 'content-manager'],
	['dress', 'contents/dist/1.0.0/dress.js'],
	['mustache', 'design-editor/node_modules/mustache/mustache.js'],
	['path', 'design-editor/node_modules/path-browserify/index.js'],
	['js-beautify', 'design-editor/node_modules/js-beautify/js/index.js'],
	['jquery', 'design-editor/node_modules/jquery/dist/jquery.js'],
	['jquery-ui', 'design-editor/node_modules/jquery-ui/jquery-ui.js'],
	['assistant-view', 'vsc-extension/design-editor/libs/assistant-view-manager.js'],
	['html-assistant-editor', 'vsc-extension/design-editor/libs/html-assistant-editor.js'],
	['@', 'vsc-extension/design-editor']
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
		alias: createAliasObject(relativeAliases)
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
		alias: createAliasObject(relativeAliases)
	},
	plugins: plugins
};

module.exports = [development, production];
