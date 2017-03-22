const webpack = require('webpack'),
    path = require('path'),
    debug = process.env.NODE_ENV !== 'production';

module.exports = function(env){
    const plugins = [
        new webpack.EnvironmentPlugin({
            NODE_ENV: debug
        })
    ];

    if (!debug) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
                comments: false,
                sourceMap: false
            })
        );
    }
    return {
        devtool: 'source-map',

        entry: path.join(__dirname, "src", "logger.js"),

        module : {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        "eslint-loader",
                        'babel-loader'
                    ]
                }
            ]
        },

        output: {
            path: __dirname + "/dist/",
            filename: "logger.bundle.js",
            library: "Logger",
            libraryTarget: 'umd',
            umdNamedDefine: true
        },

        resolve: {
            modules: [path.resolve('./src')],
            extensions: ['.json', '.js']
        },

        plugins
    }
};
