var https = require('https');
var util = require('util');

var options = {
    host: 'localhost',
    port: 8008,
    path: '/',
    // Allow self-signed certificate, for testing.
    rejectUnauthorized: false
};
var req = https.request(options, function (res) {
    console.log(util.inspect(res.headers));
    res.pipe(process.stdout);
});
req.end();

var options2 = {
    host: 'www.google.com',
    port: 443,
    method: 'GET',
    path: '/'
};
var req = https.request(options2, function (res) {
    console.log('2.');
    console.log(res.socket.address());
    console.log('authorized? ' + res.socket.authorized);
    console.log('Peer certificate:');
    console.log(res.socket.getPeerCertificate());
    var length = 0;
    res.on('readable', function () {
        var r = this.read();
        if (r) { length += r.length; }
    });
    res.on('end', function () {
        console.log('length: %d', length);
    });
});
req.on('error', function (err) {
    console.log(err.stack);
});
req.end();

