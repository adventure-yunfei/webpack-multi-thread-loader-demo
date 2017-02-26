module.exports = {
    entry: {
        myentry: './files/entry.js'
    },
    output: {
        filename: '[name].js',
        path: 'build/'
    },
    module: {
        loaders: [{
            test: /\.js$/i,
            // loader: require.resolve('./thread-loader-wrapper.js')
            loader: require.resolve('./simple-loader.js')
        }]
    }
};
