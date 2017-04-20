const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV && (process.env.NODE_ENV.trim() == 'production');
const watch = process.env.NODE_ENV && (process.env.NODE_ENV.trim() == 'dev-watch');

console.log('isProduction: ' + isProduction + "\nwatch:" + watch);

var options = {

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
            }
        ]
    },

    plugins: [
        //TODO add CSS preprocessor and move *.css to src dir;
        // new ExtractTextPlugin("css/options.css"),

        new CopyWebpackPlugin([
            {from: 'static'}
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
        })
    ]
};

module.exports = options;