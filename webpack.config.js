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

        options: [  path.join(__dirname, "src", "js", "options.js"),
                    path.join(__dirname, "src", "scss", "options.scss")],

        popup: [path.join(__dirname, "src", "js", "popup.js"), path.join(__dirname, "src", "css", "popup.css")]
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    devtool: isProduction ? '' : 'source-map',

    watch: watch,

    watchOptions: {
        aggregateTimeout: 50,
    },

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
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }]
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

        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        }),

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
            filename: "[name].css",
        })
    ]
};

module.exports = options;