// Request timing middleware.
// Options:
//  - `time`: requests taking more than this many ms will be logged.
// @param {Object} options
// @api public
module.exports = function (opts) {
    var time = opts.time || 100;
    return function (req, res, next) {
        var cookie = setTimeout(function () {
            console.log('%s %s is taking more than %d ms',
                        req.method, req.url, time);

        }, time);
        // Monkey-patch...
        var realEnd = res.end;
        res.end = function (chunk, encoding) {
            res.end = realEnd; // Restore.
            res.end(chunk, encoding);
            clearTimeout(cookie);
        };
        next();
    };
};
