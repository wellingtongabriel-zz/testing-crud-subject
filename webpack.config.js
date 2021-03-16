const modeDev = process.env.NODE_ENV !== 'production';

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    entry: ["babel-polyfill", './src/app.js'],
    mode: modeDev ? 'development' : 'production',

    output: {
        filename: "./app.js",
        path: path.resolve(__dirname, 'public/')
    },

    devServer: {
        contentBase: 'public',
        port: 9090,
        historyApiFallback: true,
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "app.css"
        })
    ],

    module: {
        rules: [{
            test: /.js[x]?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                    '@babel/plugin-proposal-object-rest-spread',
                    ["@babel/plugin-proposal-decorators", { legacy: true }],
                    ["@babel/plugin-proposal-optional-chaining", { loose: false }],
                    ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
                    ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
                    ["@babel/plugin-proposal-class-properties", { "loose": true}],
                    "@babel/plugin-transform-react-jsx",
                    'babel-plugin-react-html-attrs',
                    "@babel/plugin-proposal-export-default-from",
                    "@babel/plugin-proposal-logical-assignment-operators",
                    "@babel/plugin-proposal-do-expressions",
                    'babel-plugin-styled-components',
                ]
            }
        }, {
            test: /\.s?[ac]ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS
            ]
        }, {
            test: /\.woff|.woff2|.otf|.ttf|.eot|.svg|.png|.jpg*.*$/,
            use: 'file-loader'
        }]
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            modules: __dirname + '/node_modules'
        }
    }
};