const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv && (nodeEnv.trim() === 'production');
const watch = nodeEnv && (nodeEnv.trim() === 'dev-watch');

console.log('isProduction: ' + isProduction + "\nwatch:" + watch);

var options = {

    entry: {
        background: path.join(__dirname, "src", "js", "background.js"),
        options: [path.join(__dirname, "src", "js", "options.js"), path.join(__dirname, "src", "css", "options.css")],
        popup: [path.join(__dirname, "src", "js", "popup.js"), path.join(__dirname, "src", "css", "popup.css")]
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },

    devtool: isProduction ? '' : 'source-map',

    watch: watch,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|ico|gif|otf)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },

    plugins: [

        new CopyWebpackPlugin([{
                from: path.join(__dirname, 'static', 'icons'),
                to: 'icons'
            },{
                from: path.join(__dirname, 'static', 'img'),
                to: 'img'
            }
        ]),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"]
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        }),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: !isProduction
        }),

        new ExtractTextPlugin({
            filename: "[name].[contenthash].css"
        })
    ]
};

module.exports = options;