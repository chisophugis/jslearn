'use strict';
// Learning about buffers.

var buf = new Buffer('Hello world!');
console.log(buf);

var base64Buf = new Buffer('8b76fde713ce', 'base64');
console.log(base64Buf);

// Not zeroed. Contains uninitialized memory.
var sizedBuf = new Buffer(1024);
console.log(sizedBuf);

// Indexed access to bytes.
console.log(buf[0]);
buf[0] = 120;
// Assignments are silently truncated to their lower 8-bits. (for floats,
// it will discard the fractional part too).
buf[0] = 256 + 'h'.charCodeAt(0);
// Out of bounds assignments are silently ignored.
buf[100] = 38342;

console.log(buf.length);
console.log(buf.slice(0, 5).toString());

// Copying a buffer
var srcBuf = new Buffer('abcd');
var dstBuf = new Buffer('0123456789');

// srcBuf.copy(dstBuf, [dstStartIdx], [srcStartIdx], [srcEndIdx])
// defaults: srcBuf.copy(dstBuf, 0, 0, srcBuf.length)
srcBuf.copy(dstBuf, 0, 0, 2);

// Defaults to 'utf8'
console.log(dstBuf.toString());
// Can specify encoding.
console.log(dstBuf.toString('ascii'));

// Example: converting encoding
var s = 'foobar';
var strBuf = new Buffer(s);
console.log(strBuf.toString('base64'));
