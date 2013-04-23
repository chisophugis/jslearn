'use strict';

var http = require('http');

var options = {
    host: 'www.google.com',
    port: 80,
    path: '/index.html'
};

// Shortcut for http.request(). Calls req.end() automatically (req is a
// Writable stream, an instance of http.ClientRequest)).
var req = http.get(options, function (res) { // 'response' .once listener.
    // `res` is an instance of http.IncomingMessage (similar to the `req`
    // argument to the 'request' listener of http.Server).
    // It is a Readable stream.
    console.log('1. Got response: ' + res.statusCode);
});
req.on('error', function (err) {
    console.log('An error happened: ' + err.stack)
});


var req = http.request(options);
req.on('response', function (res) {
    console.log('2. Got response: ' + res.statusCode);
});
setTimeout(function () {
    // End the writable stream.
    req.end();
}, 1000);

// If the first argument of http.get or http.request is a string, it will
// be passed through url.parse.
http.get('http://www.google.com:80/index.html', function (res) {
    console.log('3.')
    console.log('Response status code: ' + res.statusCode);
    console.log('HTTP version is: ' + res.httpVersion);
    console.log(res.headers);
    var len = 0;
    var times = 0;
    var lengths = [];
    res.on('readable', function () {
        times += 1;
        var r = this.read();
        if (r === null) { return; }
        lengths.push(r.length);
        len += r.length;
    });
    res.on('end', function () {
        console.log('4. Length of response was: ' + len + ' bytes.');
        console.log('5. times is ' + times);
        console.log('6. lengths is\n' + lengths.join(' '));
    });
});
