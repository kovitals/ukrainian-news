const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    entry: {
        background: path.join(__dirname, "src", "js", "background.js"),
        options: path.join(__dirname, "src", "js", "options.js"),
        news: path.join(__dirname, "src", "js", "news.js")
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },

    plugins:[
        // new ExtractTextPlugin("css/options.css"),

        new CopyWebpackPlugin([
            { from: 'static' }
        ]),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "news.html"),
            filename: "news.html",
            chunks: ["news"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
        // })
    ]
};