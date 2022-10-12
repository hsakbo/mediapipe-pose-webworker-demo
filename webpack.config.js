const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


const config = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true,
        port: 3000  ,
        watchFiles: [ path.join(__dirname, 'src', '*') ],
        devMiddleware: {
            writeToDisk: true,
            index: true,
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    entry: {
        main: path.resolve(__dirname, 'index.js'),
        worker: path.resolve(__dirname, 'worker.js'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'dist', 'public') },
                { from: path.resolve(__dirname, 'index.html'), to: path.resolve(__dirname, 'dist') },
            ]
        }),
    ]
};

module.exports = config;
