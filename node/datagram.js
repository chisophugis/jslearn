'use strict';
var dgram = require('dgram'),
    util = require('util');;

// An optional second argument will be set to listen on the 'message'
// event.
var sock = dgram.createSocket('udp4');
sock.on('message', function (msg, rinfo) {
    // rinfo contains sender's address, port, IP family, and also the size
    // of the datagram (presumably this is the same as message.length).
    // `rinfo` presumably stands for 'remote info'.
    console.log('rinfo: ' + util.inspect(rinfo));
    console.log('msg: ' + msg);
    // This also takes an optional extra parameter, a callback to be called
    // when the datagram has been transferred to the kernel. This is the
    // only way to know when it is safe to reuse the buffer.
    this.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});

sock.on('listening', function () {
    console.log('Address: ' + util.inspect(this.address()));
    var a = this.address();
    console.log('Listening on %s:%d', a.address, a.port);
});

// Also accepts an optional address to listen on (default any), and also an
// optional one-shot 'listening' event listener.
sock.bind(8000);


var lonely = dgram.createSocket('udp4');
function backoff(f) {
    var backoff = 1000;
    function flow() {
        f();
        setTimeout(flow, backoff);
        backoff *= 2;
    }
    flow();
}
function beLonely() {
    function onSent(err, bytes) {
        if (err) { throw err; }
        console.log('Sent %d bytes (msg.length was %d)', bytes, msg.length);
        // Safe to reuse the `msg` Buffer.
    }
    var msg = new Buffer('Anybody there?\n');
    lonely.send(msg, 0, msg.length, 4001, 'localhost', onSent);
}
backoff(beLonely);


// Multicast.
// To test, run multiple instances of this file, then
// $ echo "hi" | nc -u 230.1.2.3 8002
var multicaster = dgram.createSocket('udp4', function (msg, rinfo) {
    console.log('multicast msg: %j', msg.toString());
});
// Have to pass in the address here. See
// <https://github.com/joyent/node/commit/92023b>
multicaster.bind(8002, '0.0.0.0', function () {
    // The reverse operation is this.dropMembership(addr).
    // Note that specific IP address ranges are reserved for multicast.
    this.addMembership('230.1.2.3');
});
