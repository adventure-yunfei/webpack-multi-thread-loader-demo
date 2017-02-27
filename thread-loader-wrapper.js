var child_process = require('child_process');
var path = require('path');

module.exports = function (content) {
    var callback = this.async();
    var cp = child_process.fork(path.join(__dirname, 'thread-runner.js'));
    cp.on('message', function (msg) {
        callback(null, msg.data);
    });
    cp.send({
        query: this.query,
        data: content
    });
};
