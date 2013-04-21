'use strict';

var net = require('net'),
    Transform = require('stream').Transform;

// A lot of places you can conveniently pass a function and have it
// attached to a relevant listener of the net.Server class.
var srv1 = net.createServer(function (socket) { // 'connection' listener.
    socket.pipe(process.stdout);
}).listen(8000, function () { // 'listening' listener.
    var address = this.address();
    console.log('Server is listening on port %s.', address.port);
});

srv1.on('error', function (err) {
    console.log('Error occurred: ' + err.message);
});

process.nextTick(function () {
    srv1.close(function () { // 'close' listener.
        console.log('Server has closed');
    });
});

// The above is mostly equivalent to this:
// (some modifications to add new concepts).
var server = net.createServer();
server.on('connection', function (socket) {
    socket.pipe(process.stdout);
});
server.on('listening', function () {
    var address = this.address();
    console.log('Server is listening on port %s.', address.port);
});
server.on('error', function (err) {
    console.log('Error occurred: %j', err.message);
    if (err.code == 'EADDRINUSE') {
        console.log('Address in use.');
    }
});
server.on('close', function () {
    console.log('Server has closed');
});
server.listen(8000);

var echo = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    var s = new Transform({ decodeStrings: false });
    s._transform = function (chunk, encoding, done) {
        if (chunk.trim().toLowerCase() === 'quit') {
            this.end();
        } else {
            this.push(chunk);
        }
        done();
    };
    socket.pipe(s).pipe(socket);
    socket.on('finish', function () {
        console.log('finished with this socket');
    });
    socket.setTimeout(1000, function () { // .once('timeout', ...) listener.
        console.log('timing out... see this once');
    });
    var timeouts = 0;
    socket.on('timeout', function () {
        timeouts += 1;
        console.log('timing out... for time #%d', timeouts);
        if (timeouts == 5) {
            console.log('Too many timeouts! kicking...');
            this.end();
        }
    });
    socket.on('error', function (err) {
        console.log(err);
    });
});
echo.listen(8080, function () {
    console.log('echo server listening on %d', this.address().port);
});
echo.on('error', function (err) {
    console.log('Uh oh, an error:');
    console.log(err.stack);
});
process.nextTick(function () {
    // This won't terminate the server or anything, just testing that the
    // 'error' handler is getting called.
    echo.emit('error', new Error('Self-inflicted test error'));
});
