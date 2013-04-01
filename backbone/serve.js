var http = require('http');
var ecstatic = require('ecstatic');

var ecstaticOpts = { root: __dirname };

http.createServer(
    ecstatic(ecstaticOpts)
).listen(8080);

console.log('Listening on :8080');
console.log('%s', JSON.stringify(ecstaticOpts, null, 2));
