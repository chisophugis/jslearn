// argv[2] is the port to listen on for gossiping
// argv[2] + 1000 is the port to listen on for http connections (so that
// you can control the gossip network via HTTP)
// argv[3...] is a list of ports to gossip with.

var Model = require('scuttlebutt/model');
var net = require('net');

var http = require('http');
var qs = require('querystring');


var s = new Model();
var z = new Model();
s.on('update', function (kv, ts, source) {
    var k = kv[0], v = kv[1];
    console.log('Updating %j:%j [%j,%j]', k, v, ts, source);
});
var port = Number(process.argv[2] || 8000);
var httpPort = port + 1000;
// `curl 'http://localhost:$httpPort/?foo=bar'` to set variables
http.createServer(function (req, res) {
    var kv = qs.parse(req.url.split('?')[1]);
    for (var k in kv) {
        s.set(k, kv[k]);
    }
    res.end();
}).listen(httpPort, function () {
    console.log('Submit kv\'s to %d', this.address().port);
});

net.createServer(function (sock) {
    console.log('Connection from: %j', sock.address());
    sock.pipe(s.createStream()).pipe(sock);
}).listen(port, function () {
    process.argv.slice(3).forEach(function (port) {
        var conn = net.connect(Number(port), function () {
            console.log('Connecting to port %d', port);
            conn.pipe(s.createStream()).pipe(conn);
        });
    });
});

