'use strict';
var http = require('http'),
    util = require('util'),
    path = require('path'),
    fs = require('fs');

var helloWorld = http.createServer();
helloWorld.on('request', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello world!');
    res.end();
});
helloWorld.listen(8000);

// Same as the above example, but shorter.
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world!');
}).listen(8001);

http.createServer(function (req, res) {
    res.setHeader('Foo-Bar', 'baz'); // Must call before writeHead or write.
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'max-age=3600'
    });
    res.write('URL: ' + req.url + '\n');
    res.write('Method: ' + req.method + '\n');
    res.write('Headers:\n');
    res.write(util.inspect(req.headers));
    res.end();
}).listen(8002);

http.createServer(function (req, res) {
    function noFile() {
        res.writeHead(404);
        res.end('File not found');
    }
    var filePath = path.normalize('.' + req.url);
    // Security hazard.
    if (filePath.indexOf('..') !== -1) { noFile(); return; }

    fs.exists(filePath, function (exists) {
        if (!exists) { noFile(); return; }
        fs.stat(filePath, function (err, stats) {
            if (err) { noFile(); return; }
            if (!stats.isFile()) { noFile(); return; }
            fs.createReadStream(filePath).pipe(res);
        });
    });

}).listen(8003);

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var times = 0;
    var cookie = setInterval(function () {
        for (var i = 0; i !== 20; ++i) {
            res.write(Date.now() + '\n');
        }
        times += 1;
        if (times === 10) {
            clearInterval(cookie);
            res.end();
        }
    }, 1000);
}).listen(8004);
