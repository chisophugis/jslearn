var connect = require('connect');
var time = require('./request-time.js');

var server = connect.createServer();

server.use(time({ time:500 }));

server.use(function (req, res, next) {
    if (req.url === '/fast') {
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('Fast!');
    } else {
        next();
    }
});

server.use(function (req, res, next) {
    if (req.url === '/slow') {
        setTimeout(function () {
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end('Slow...');
        }, 1000);
    } else {
        next();
    }
});

server.listen(8080);
