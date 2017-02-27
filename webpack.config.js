var useThreadLoader = process.env.MULTI_THREAD === 'true',
    logSync = process.env.LOG_SYNC === 'true';

module.exports = {
    entry: {
        myentry: './files/a.js'
    },
    output: {
        filename: '[name].js',
        path: 'build/'
    },
    module: {
        loaders: [{
            test: /\.js$/i,
            loader: require.resolve(useThreadLoader ? './thread-loader-wrapper.js' : './simple-loader.js') + '?' + (logSync ? 'sync=true' : '')
        }]
    }
};
