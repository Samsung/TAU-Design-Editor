/* eslint-env mode, es6 */
/* global module, __dirname */
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NormalModuleReplacementPlugin = webpack.NormalModuleReplacementPlugin;
const CONTEXT = path.resolve(__dirname, '..');
const OUTPUT = path.resolve(CONTEXT, 'dist/watt');
const plugins = [
    new CopyWebpackPlugin([
        {from: path.resolve(CONTEXT, 'brackets-extension')},
        {from: path.resolve(CONTEXT, 'design-editor/src'), to: path.resolve(OUTPUT, 'design-editor/closet')},
        {from: path.resolve(CONTEXT, 'closet-default-component-packages'), to: path.resolve(OUTPUT, 'design-editor/node_modules/closet-default-component-packages')},
        {from: path.resolve(CONTEXT, 'closet-component-packages'), to: path.resolve(OUTPUT, 'design-editor/node_modules/closet-component-packages')},
        {from: path.resolve(CONTEXT, 'tau-component-packages'), to: path.resolve(OUTPUT, 'design-editor/node_modules/tau-component-packages')},
        {from: path.resolve(CONTEXT, 'content-manager'), to: path.resolve(OUTPUT, 'design-editor/node_modules/content-manager')},
        {from: path.resolve(CONTEXT, 'design-editor/styles'), to: path.resolve(OUTPUT, 'design-editor/styles')}
    ])
];
const alias = {
    labels: path.resolve(CONTEXT, 'brackets-extension/design-editor/labels.js'),
    fs: path.resolve(CONTEXT, 'brackets-extension/design-editor/libs/fs-mock.js'),
    'fs-extra': path.resolve(CONTEXT, 'brackets-extension/design-editor/libs/fs-extra.js'),
    'fs-remote': path.resolve(CONTEXT, 'brackets-extension/design-editor/libs/fs-remote.js'),
    atom: path.resolve(CONTEXT, 'brackets-extension/design-editor/libs/atom.js'),
    remote: path.resolve(CONTEXT, 'design-editor/libs/remote.js'),
    'closet-default-component-packages': path.resolve(CONTEXT, 'closet-default-component-packages'),
    'closet-component-packages': path.resolve(CONTEXT, 'closet-component-packages'),
    'tau-component-packages': path.resolve(CONTEXT, 'tau-component-packages'),
    'content-manager': path.resolve(CONTEXT, 'content-manager'),
    dress: path.resolve(CONTEXT, 'contents/dist/1.0.0/dress.js'),
    mustache: path.resolve(CONTEXT, 'design-editor/node_modules/mustache/mustache.js'),
    path: path.resolve(CONTEXT, 'design-editor/node_modules/path-browserify/index.js'),
    'js-beautify': path.resolve(CONTEXT, 'design-editor/node_modules/js-beautify/js/index.js'),
    jquery: path.resolve(CONTEXT, 'design-editor/node_modules/jquery/dist/jquery.js'),
    'jquery-ui': path.resolve(CONTEXT, 'design-editor/node_modules/jquery-ui/jquery-ui.js'),
    'assistant-view': path.resolve(CONTEXT, 'brackets-extension/design-editor/libs/assistant-view/assistant-view-manager.js'),
    'html-assistant-editor': path.resolve(CONTEXT, 'brackets-extension/design-editor/libs/html-assistant-editor.js')
};

const production = {
    name: 'production',
    context: CONTEXT,
    node: {
        __filename: true,
        __dirname: true
    },
    entry: path.resolve(CONTEXT, 'design-editor/src/brackets/brackets-editor.js'),
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
                            plugins: [
                                'transform-es2015-parameters',
                                'transform-es2015-spread',
                                'transform-es2015-arrow-functions',
                                'transform-es2015-block-scoped-functions',
                                'transform-es2015-block-scoping',
                                'check-es2015-constants',
                                'transform-es2015-destructuring',
                                'transform-es2015-literals',
                                'transform-es2015-shorthand-properties',
                                'transform-es2015-template-literals'
                            ]
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
        alias: alias
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
    entry: path.resolve(CONTEXT, 'design-editor/src/brackets/brackets-editor.js'),
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
                            plugins: [
                                'transform-es2015-parameters',
                                'transform-es2015-spread',
                                'transform-es2015-arrow-functions',
                                'transform-es2015-block-scoped-functions',
                                'transform-es2015-block-scoping',
                                'check-es2015-constants',
                                'transform-es2015-destructuring',
                                'transform-es2015-literals',
                                'transform-es2015-shorthand-properties',
                                'transform-es2015-template-literals'
                            ],
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
        alias: alias
    },
    plugins: plugins
};

module.exports = [development, production];
