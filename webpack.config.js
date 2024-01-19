const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const zlib = require("zlib");
const webpack = require("webpack");
const packageJson = require('./package.json');
const path = require('path');

const configMode = process.env.NODE_ENV;

module.exports = {
    mode: configMode === 'development' ? 'development' : 'production',
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[contenthash].bundle.js',
        chunkFilename: '[name].[contenthash].chunk.js',
        publicPath: '/',
        clean: true,
        asyncChunks: true,
    },
    devServer: {
        hot: configMode === 'development' ? true : false,
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: packageJson.proxy, // taking proxy from package.json file
                secure: false,
                changeOrigin: true,
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: require.resolve('babel-loader'),
                    options: {
                        plugins: [configMode === 'development' && require.resolve('react-refresh/babel')].filter(Boolean),
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    configMode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 
                    'css-loader'
                ],
            },
            {
                test: /\.(png|j?g|svg|gif)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                include: path.resolve(__dirname, 'public/fonts'),
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                },
                extractComments: false,
                parallel: true,
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
                minify: CssMinimizerPlugin.cssoMinify
            }),
        ],
        splitChunks: {
            minSize: 17000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: "_",
            enforceSizeThreshold: 30000,
            cacheGroups: {
                common: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -5,
                    reuseExistingChunk: true,
                    chunks: "initial",
                    name: "common_app",
                    minSize: 0,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                // Opting out of defaultVendors
                defaultVendors: false,
                reactPackage: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                    name: 'vendor_react',
                    chunks: "all",
                    priority: 10,
                }
            },
        },        
    },
    plugins: [
        process.env.NODE_ENV === 'development' && new ReactRefreshWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        // new BundleAnalyzerPlugin(),
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),
        new MiniCssExtractPlugin({
            ignoreOrder: true,
            linkType: "text/css",
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
        }),
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            }
        }),
    ].filter(Boolean),
    // devtool: 'source-map'
};