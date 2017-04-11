const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    entry: {
        background: path.join(__dirname, "src", "js", "background.js")
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
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

    module: {
        rules: [
            { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
            { test: /\.css$/, loader: "style-loader!css-loader", exclude: /node_modules/  }
        ]
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