var fs = require('fs');

fs.stat('/etc/passwd', function (err, stats) {
    if (err) { throw err; }
    console.log(stats);
    console.log('Is a file? ' + String(stats.isFile()));
    console.log('Is a directory? ' + String(stats.isDirectory()));
    console.log('Is a symbolic link? ' + String(stats.isSymbolicLink()));
});

// Low level file operations with file descriptors.
//
// You probably shouldn't use these too often. They can be error-prone
// since the async operations are unsequenced, so you can't just e.g. open
// a file in append mode and call fs.write() twice in a row (without one
// happening inside the callback of the other) to append two different
// pieces of data, since you can't guarantee which write will actually
// happen first; there needs to be buffering or some other level of
// handling to ensure that.

fs.open('/etc/passwd', 'r', function (err, fd) {
    if (err) { throw err; }
    console.log('Have /etc/passwd in fd: ' + String(fd));
    // Do not reuse this buffer until the fs.read callback returns!
    var readBuffer = new Buffer(64),
        bufferOffset = 0,
        bufferLength = readBuffer.length,
        filePosition = 100;
    fs.read(fd,
            readBuffer, bufferOffset, bufferLength,
            filePosition, function (err, readBytes) {
        if (err) { throw err; }
        console.log('Read ' + String(readBytes) + ' bytes.');
        console.log(readBuffer.slice(bufferOffset, readBytes).toString());
    });
});

var fileName = './someFile.txt';

fs.open(fileName, 'a', function (err, fd) {
    if (err) { throw err; }
    console.log('Have ' + fileName + ' in fd: ' + String(fd));
    // Do not reuse this buffer until the fs.write callback returns!
    var writeBuffer = new Buffer('Some text for ./someFile.txt\n'),
        bufferOffset = 0,
        bufferLength = writeBuffer.length,
        filePosition = 0;
    fs.write(fd,
            writeBuffer, bufferOffset, bufferLength,
            filePosition, function (err, writtenBytes) {
        if (err) { throw err; }
        console.log('Wrote ' + String(writtenBytes) + ' bytes.');
        console.log('Closing the file...');
        fs.close(fd, function () {
            console.log(fileName + ' is now closed.');
        });
    });
});
