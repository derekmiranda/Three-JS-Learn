var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
            }
        ]
    }
}