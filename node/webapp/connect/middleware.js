var connect = require('connect');

var server = connect.createServer();
// Pass middlewares to server.use() in order to register them. Order of
// registration does matter.
server.use(connect.static(__dirname + '/static'));

// The "middleware pattern": pass a `next` function as the last argument,
// which the handler then calls when they are done.
// This is a very clean encapsulation mechanism, since the middleware
// function knows nothing about what comes before or after, since the
// `next` function is entirely opaque.
// (It's also kind of stream-like in the sense that it is an "array in
// time").
server.use(function (req, res, next) {
    // Also check out the connect.logger() middleware.
    console.log('%s %s', req.method, req.url);
    next();
});
server.use(function (req, res, next) {
    if (req.url !== '/trapped') {
        next();
        return;
    }
    // Don't call next() if they visit /trapped, meaning that this handler
    // is the endpoint of this request (no further middlewares have a
    // chance to handle it).
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hi from a middleware endpoint.\n');
});

// You can "mount" middleware at specific paths. This is chainable, so that
// you can mount a whole connect server on a path of another server.
// The .route property of the connect server holds the path of its parent
// that it is mounted at.
server.use('/static', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Original URL: ' + req.originalUrl + '\n');
    res.write('URL we see: ' + req.url + '\n');
    res.end();
});
// Another example; mount a filesystem tree at a specific path:
// server.use(‘/js’, connect.static(‘/path/to/bundles’));

// Any middlewares after this one will have access to req.query, which will
// contain the query parameters in a dictionary.
// /foo?bar=baz --> req.query === {'bar': 'baz'}
server.use(connect.query());
// Parse POST body and put a dictionary into req.body. Handles urlencoded
// and JSON (it looks at Content-Type).
// It will also use node-formidable to handle file uploads and put them
// into req.body.file
server.use(connect.bodyParser());


server.listen(8080);

