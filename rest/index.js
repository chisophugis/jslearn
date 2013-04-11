var fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;


var argv = require('optimist')
    .string('file')
    .default('file',
             '/home/sean/pg/llvm/llvm/docs/SphinxQuickstartTemplate.rst')
    .check(function (argv) { return typeof argv.file === 'string'; })
    .argv
;

function InputL1(filename) {
    this.constructor.super_.call(this);
    var inputStream = fs.createReadStream(filename, {encoding: 'utf8'});
    inputStream.on('readable', function () {
        console.log(inputStream.read());
    });
    inputStream.on('end', function () {
        console.log('All done!');
    });
}

util.inherits(InputL1, EventEmitter);

console.log('Handling:', util.inspect(argv.file));

new InputL1(argv.file);
