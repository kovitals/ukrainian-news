const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    entry: {
        'background': './src/background.js',
        'app': './src/news.js',
        'options': './src/options.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.map'
    },

    devtool: 'source-map',

    module: {
        // rules: [
        //     {
        //         test: /\.js$/,
        //         exclude: [/node_modules/],
        //         use: [{
        //             loader: 'babel-loader',
        //             options: { presets: ['es2015'] }
        //         }],
        //     },
        //
        //     // Loaders for other file types can go here
        // ],
    },

    plugins:[
        new CopyWebpackPlugin([
            { from: 'static' }
        ])
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
        // })
    ]
};