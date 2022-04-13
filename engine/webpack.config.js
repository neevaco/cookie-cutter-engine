const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

module.exports = {
    experiments: { asyncWebAssembly: true },
    entry: {
        engine: './src/entry.ts',
    },
    mode: isDev ? 'development' : 'production',
    output: {
        path: path.resolve(__dirname, './dist'),
        library: {
            name: 'CookieEngine',
            type: 'umd',
            export: 'CookieEngine',
        },
    },
    plugins: [
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
    },
};
