var stream = require('stream');
var Transform = stream.Transform;
var Readable = stream.Readable;
var Writable = stream.Writable;

var t = new Transform({objectMode: true});
t._transform = function (chunk, encoding, done) {
    console.log('in transform: %j', chunk);
    console.trace('t counter: ' + chunk.foo);
    chunk.foo += 1000;
    this.push(chunk);
    // setImmediate(done);
    done();
};

var w = new Writable({objectMode: true});
w._write = function (chunk, encoding, done) {
    console.log('in writable: %j', chunk);
    done();
};

var r = new Readable({objectMode: true});
r.counter = 0;
r._read = function () {
    for (;;) {
        if (this.counter === 10) {
            return;
        }
        var b = this.push({foo: this.counter});
        this.counter += 1;
        if (!b) {
            return;
        }
    }
};

r.pipe(t).pipe(w);
