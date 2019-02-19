const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackVisualizerPlugin = require('webpack-visualizer-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

// const OfflinePlugin = require('offline-plugin');

const config = require('./config.json');

const devMode = process.env.NODE_ENV !== 'production';

const devServer = devMode? {
    inline: true,
    port: config.port,
    // return app bundle at any request
    historyApiFallback: true,
    // static content base path
    contentBase: path.join(__dirname, '..',  'public'),
    proxy   : {
        "/api": config.proxy
    },
    disableHostCheck: true
} : undefined;

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    inject   : 'body',
    template : paths.appHtml,
    filename : './index.html',
});

const plugins = [
    HTMLWebpackPluginConfig,
    new HtmlWebpackHarddiskPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-au/),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: devMode ? JSON.stringify('development') : JSON.stringify('production'),
        },
    })
]

if (devMode) {
    plugins.push( new webpack.HotModuleReplacementPlugin() );
} else {
    plugins.push(
        // keep vendor bundle unchanged when only module.id was changed, see:
        // https://webpack.js.org/guides/caching/#module-identifiers
        new webpack.HashedModuleIdsPlugin(),
        // extract css files
        new MiniCssExtractPlugin({
            filename: 'stylesheet/[name].[hash].css',
            chunkFilename: 'stylesheet/[id].[hash].css',
        }),
        new WebpackVisualizerPlugin(),
        new WorkboxPlugin.GenerateSW({
            swDest: 'service-worker.js',
            clientsClaim: true,
            skipWaiting: true,
        })
    );
}


module.exports = {
    entry: ['babel-polyfill', './source/index.js'],
    mode: devMode? 'development' : 'production',
    output: {
        path: paths.appBuild,
        // user chunk hash to elimilate browser cache
        filename: 'javascript/[name].[hash].bundle.js',
        chunkFilename: 'javascript/[name].chunk.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-2'],
                },
            },
            {
                test: /\.css$/,
                use:  [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: !devMode,
                        },
                    },
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name       : '[sha512:hash:base64:10].[ext]',
                            outputPath : 'images/'
                        }
                    }
                ]
            }
        ],
    },
    devServer: devServer,
    plugins: plugins,
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    reuseExistingChunk: true,
                    priority: 1,
                    enforce: true,
                    test(module, chunks) {
                        const name = module.nameForCondition && module.nameForCondition();
                        return chunks.some(chunk => {
                            return chunk.name === 'main' && /[\\/]node_modules[\\/]/.test(name);
                        });
                    }
                },
                secondary: {
                    name: 'secondary',
                    chunks: 'all',
                    priority: 2,
                    enforce: true,
                    test(module, chunks) {
                        return chunks.some(chunk => chunk.name === 'secondary');
                    }
                }
            }
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        symlinks: false
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    }
}