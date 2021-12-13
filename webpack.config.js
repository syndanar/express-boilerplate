const nodeExternals = require('webpack-node-externals');
const path = require('path');
const npm_package = require('./package.json')

const {
    NODE_ENV = 'production',
} = process.env;
module.exports = {
    entry: './src/server.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    watch: NODE_ENV === 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader',
                ]
            }
        ]
    },
    externals: [ nodeExternals() ]
}
