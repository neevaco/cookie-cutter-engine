// Copyright 2022 Neeva Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

module.exports = {
    experiments: { asyncWebAssembly: true },
    entry: {
        page: './src/page/index.ts',
        contentScript: './src/contentScript/index.ts',
        popup: './src/popup/index.ts',
    },
    mode: isDev ? 'development' : 'production',
    output: {
        path: path.resolve(__dirname, './crx'),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/popup/index.html'),
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './manifest.json',
                    to: '.',
                },
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
                isDev ? 'development' : 'production'
            ),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: ['last 5 Chrome versions'],
                                },
                                useBuiltIns: 'usage',
                                corejs: { version: 3 },
                            },
                        ],
                        '@babel/preset-typescript',
                    ],
                },
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
    devtool: 'inline-cheap-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            common: path.resolve(__dirname, './src/common'),
            engine: path.resolve(__dirname, '../engine/src'),
        },
    },
};
