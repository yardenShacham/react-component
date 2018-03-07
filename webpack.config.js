const webpack = require('webpack');
const path = require('path');

const BUILD_DIR_PLAYGORUND = path.resolve(__dirname, './test-playgorund/public');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
//var OpenBrowserPlugin = require("open-browser-webpack-plugin");

var config = {
    entry: {
        main: './test-playground/index.js'
    },
    output: {
        path: BUILD_DIR_PLAYGORUND,
        filename: '[name].[hash].js',
        publicPath: './'
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: BUILD_DIR_PLAYGORUND,
        compress: true,
        port: 8080,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['es2015', {modules: false}]],
                            plugins: ['syntax-dynamic-import', 'transform-class-properties']
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader'],
                    publicPath: BUILD_DIR_PLAYGORUND
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                    publicPath: BUILD_DIR_PLAYGORUND
                })
            },
            {
                test: /\.(ico|png|gif|jpg|svg)$/i,
                use: [{
                    loader: 'file-loader'
                }]
            }, {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{loader: 'url-loader?limit=100000'}]
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Junux Managment',
            filename: 'index.html',
            template: 'test-playground/test-playground.html'
        }),
        new ExtractTextPlugin({
            filename: "[name].[hash].css",
            allChunks: true
        })
    ]
};

module.exports = config;