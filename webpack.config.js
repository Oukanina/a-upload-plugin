var webpack = require('webpack');
var ExtractTextWebpackPlgin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

var env = process.argv.indexOf('--production') > -1 ? 'production' : 'development';

module.exports = {
    entry: {
        index: './index.js'
    },

    output: {
        filename: '[name].js',
        path: 'dist'
    },

    module: {
        loaders:[
            { 
                test: /\.css$/, 
                loader: ExtractTextWebpackPlgin.extract("style-loader", "css-loader")
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextWebpackPlgin('[name].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join('demo.html'),
            chunks: ['index']
        })
    ],

    devServer: {
        historyApiFallback: true,
        inline: true,
        hot: true,
        contentBase: 'dist',
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: false
        }
    },

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};