function logPeriodlyAsync(callback, msg = 'log', interval = 1000, repeat = 3) {
    msg = 'ASYNC: ' + msg;
    var cnt = 0;
    (function logIt() {
        cnt ++;
        console.log(msg);
        if (cnt < repeat) {
            setTimeout(logIt, interval);
        } else {
            callback();
        }
    })();
}

function logPeriodlySync(callback = () => 0, msg = 'log', interval = 1000, repeat = 3) {
    msg = 'SYNC: ' + msg;
    var cnt = 1;
    console.log(msg);
    var prevTime = Date.now();
    while (cnt < repeat) {
        if (Date.now() - prevTime >= interval) {
            prevTime = Date.now();
            cnt ++;
            console.log(msg);
        }
    }
    callback();
}

module.exports = function (content) {
    var callback = this.async();
    var newContent = '// comment added by simple-loader\n' + content;
    logPeriodlySync(() => {
        callback(null, newContent);
    }, content);
};
