var connect = require('connect');

var server = connect(connect.cookieParser());

server.use(function (req, res, next) {
    console.log(req.cookies);
    res.end('Thanks.\n');
});

server.listen(8080);
