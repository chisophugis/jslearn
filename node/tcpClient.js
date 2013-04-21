'use strict';
var net = require('net');

// Second argument is a 'connect' listener.
// `host` option defaults to localhost
var conn = net.createConnection({port: 8080, host: 'localhost'}, function () {
    console.log('Remote port: %d', this.remotePort)
    console.log('Remote address: %s', this.remoteAddress)
    console.log('Local port: %d', this.localPort)
    console.log('Local address: %s', this.localAddress)
    conn.write('Hello!\n');
    setTimeout(function () {
        conn.end('Bye!\n');
    }, 1000);
});
conn.on('error', function (err) {
    // err.code is basically a string for the errno name.
    console.log('Oopsies: %j %j', err.message, err.code);
    console.log(err.stack);
});
conn.pipe(process.stdout);
