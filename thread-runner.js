var simpleLoader = require('./simple-loader');

process.on('message', function (msg) {
    simpleLoader.call({
        async: () => (err, data) => process.send({
            id: msg.id,
            data: data
        })
    }, msg.data);
});
