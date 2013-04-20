'use strict';

var EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();
ee.emit('foo');
// Will throw this exception, since there are no listeners.
// ee.emit('error', new Error('Some error'));
ee.on('error', function (err) {
    console.log(err);
});
// Now there is a listener, so this will just call the 'error' listener.
ee.emit('error', new Error('Special \'error\' event'));

// Event listeners are called in the order they are registered.
try {
    ee.on('foo', function () {
        console.log('I registered first.');
    });
    ee.on('foo', function () {
        console.log('I registered second.');
    });
    ee.on('foo', function () {
        throw new Error('Error thrown in foo handler');
    });
    ee.on('foo', function () {
        console.log('I won\'t be called because of the thrown exception.');
    });
    ee.emit('foo');
} catch (e) {}

// Event listeners can be removed
function removeMe() {
    console.log('This won\'t be printed because of I will be removed');
}
ee.on('c', removeMe);
ee.removeListener('c', removeMe);
ee.emit('c');
// There is also a .removeAllListeners('event') function, but that is less
// often useful (and generally violates the separation of concerns that
// EventEmitters allow, namely that different subscribers can independently
// subscribe to events).

// Schedule an event to run only once.
ee.once('d', function () {
    console.log('You will only see this once.');
});
ee.emit('d');
ee.emit('d');


// `this` in event handlers is the EventEmitter that they were attached to.
ee.someProperty = 'Property on the EventEmitter';
ee.on('a', function () {
    console.log(this.someProperty);
});
ee.emit('a');
