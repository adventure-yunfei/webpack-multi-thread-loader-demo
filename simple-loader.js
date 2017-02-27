var loaderUtils = require('loader-utils');

function log(title, content, contentPad = 4) {
    var contentLines = content.split('\n');
    if (contentLines.length <= 1) {
        console.log('# ' + title + ' ' + content);
    } else {
        console.log(
            ['# ' + title].concat(
                contentLines.map(function (line) { return '    ' + line})
            ).join('\n')
        );
    }
}

function logPeriodlyAsync(callback, msg, interval = 1000, repeat = 3) {
    var cnt = 0;
    (function logIt() {
        cnt ++;
        log('ASYNC: Compiling: ', msg);
        if (cnt < repeat) {
            setTimeout(logIt, interval);
        } else {
            callback();
        }
    })();
}

function logPeriodlySync(callback, msg, interval = 1000, repeat = 3) {
    var cnt = 0;
    var prevTime = 0;
    while (cnt < repeat) {
        if (Date.now() - prevTime >= interval) {
            prevTime = Date.now();
            cnt ++;
            log('SYNC: Compiling: ', msg);
        }
    }
    callback();
}

module.exports = function (content) {
    var options = loaderUtils.getOptions(this) || {};
    var callback = this.async();
    var newContent = '// comment added by simple-loader\n' + content;
    (options.sync ? logPeriodlySync : logPeriodlyAsync)(() => {
        callback(null, newContent);
    }, content);
};
