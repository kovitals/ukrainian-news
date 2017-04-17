const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV && (process.env.NODE_ENV.trim() == 'production');
const watch = process.env.NODE_ENV && (process.env.NODE_ENV.trim() == 'dev-watch');

console.log('isProduction: ' + isProduction + "\nwatch:" + watch);

module.exports = {

    entry: {
        background: path.join(__dirname, "src", "js", "background.js"),
        options: path.join(__dirname, "src", "js", "options.js"),
        popup: path.join(__dirname, "src", "js", "popup.js")
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
                loader: "babel-loader",
                exclude: /node_modules/
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
            }
        ]
    },

    plugins:[
        // new ExtractTextPlugin("css/options.css"),

        new CopyWebpackPlugin([
            { from: 'static' }
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
        })

        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
        // })
    ]
};