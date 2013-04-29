var fs = require('fs');
var connect = require('connect');

var server = connect(
    connect.bodyParser(),
    connect.static('static')
);

// connect.bodyParser() is really just the three middlewares which handle
// specific content-types:
// connect.json() application/json
// connect.urlencoded() application/x-www-form-urlencoded
// connect.multipart() multipart/form-data (uses node-formidable)
//
// connect.json() handles e.g.:
// curl -d '{"user":{"name":"sean"}}'
//      -H 'Content-Type: application/json'
//      localhost:8000
// -->
// req.body.user.name = 'sean'

// connect.urlencoded() handles e.g.:
// curl -d 'user[name]=sean' localhost:8000
// -->
// req.body.user.name = 'sean'
//
// connect.multipart() handles e.g.:
// curl -F 'file=@/home/sean/bin/viq'
//      -F 'file2=</home/sean/bin/viq'
//      localhost:8000
// -->
// req.files = { file: <node-formidable file for viq> }
// req.body = { file2: 'string content of viq' }




server.use(function (req, res, next) {
    if ('POST' === req.method) {
        console.log(req.files);
        console.log(req.body);
        var thefile = req.files.thefile;
        fs.readFile(thefile.path, 'utf8', function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end('Error!');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end([
                '<h3>File: ' + thefile.name + '</h3>',
                '<h4>Type: ' + thefile.type + '</h4>',
                '<h4>Contents:</h4><pre>' + data + '</pre>'
            ].join(''));
        });
    } else {
        next();
    }
});

server.listen(8000);
