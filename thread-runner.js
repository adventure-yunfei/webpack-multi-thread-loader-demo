var simpleLoader = require('./simple-loader');

process.on('message', function (msg) {
    var loaderContext = {
        // 这里伪造了 Webpack Loader API: .async, .query
        async: function () {
            return function (err, data) {
                process.send({
                    id: msg.id,
                    data: data
                });
                process.exit(0);
            };
        },
        query: msg.query
    };
    simpleLoader.call(loaderContext, msg.data);
});
