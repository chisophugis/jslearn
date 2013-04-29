// This shows how to use basic HTTP authentication.
// The browser shows the login dialog itself, rather than it being
// something in your webpage.

var connect = require('connect');
var util = require('util');
process.stdin.resume();
process.stdin.setEncoding('utf8');

var server = connect(
    connect.basicAuth(function (user, pass, cb) {
        process.stdout.write(
            util.format('Allow user %j with pass %j?', user, pass));
        process.stdin.once('data', function (data) {
            console.log(data);
            if (data.charAt(0) === 'y') {
                cb(null, { user: user });
            } else {
                cb(new Error('unauthorized'));
            }
        });
    }),
    function (req, res, next) {
        res.writeHead(200, {'Content-Type':'text/plain'});
        res.end('Welcome to the protected area');
    }
);

server.listen(8000);
