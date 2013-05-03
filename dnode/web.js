var http = require('http');
var dnode = require('dnode');
var qs = require('querystring');
var upnode = require('upnode');
var up = upnode.connect(8090);

//dnode.connect(8090, function (remote, conn) {
//});
http.createServer(function (req, res) {
    if (req.url.match(/^\/login/)) {
        var param = qs.parse(req.url.split('?')[1]);
        up(function (remote) {
            remote.auth(param.user, param.pass, function (err) {
                res.end(err ? err : 'OK!');
            });
        });
    } else {
        res.end('Hi\n');
    }
}).listen(8080);
