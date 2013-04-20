var child_process = require('child_process');

// For the most basic use cases.
// Just accumulates the stdout and stderr into buffers.
var exec = child_process.exec;
exec('ls', function (err, stdout, stderr) {
    if (err) { throw err; }
    console.log('stdout:\n' + stdout);
});

// It actually calls through sh, so pipelines and general shell
// functionality is supported:
exec('cat *.js | wc -l', function (err, stdout, stderr) {
    if (err) { throw err; }
    console.log('Number of lines of JS is: ' + stdout)
});

// There are also a number of options you can set by passing an options
// object as the second parameter.
var options = {
    // Note that the environment is *just* this! and PWD. It is not
    // inherited from process.env.
    env: { 'HI_FROM_NODE': 'hi' },
    cwd: '/tmp/'
};
exec('env ', options, function (err, stdout, stderr) {
    if (err) { throw err; }
    console.log(stdout);
});


// For full control.
var spawn = child_process.spawn;

var child = spawn('ls', ['-lh', '/usr']);
child.stdout.on('data', function (data) {
    console.log('Data from ls:');
    console.log(data.toString());
});

var adder = spawn('node', ['adder.js']);

setInterval(function () {
    var number = Math.floor(Math.random() * 10000);
    adder.stdin.write(number + '\n');
    adder.stdout.once('data', function (data) {
        var receivedNumber = parseInt(data.toString(), 10);
        console.log('Sent ' + number + ' Got back ' +
                    receivedNumber +
                    ' Difference ' + (receivedNumber - number));
    });
}, 1000);
setInterval(function () {
    console.log('Bumping increment.');
    adder.kill('SIGUSR1');
}, 2000);



// Basic handling of the 'exit' event.
var sleeper = spawn('sleep', ['2']);
sleeper.on('exit', function (code) {
    console.log('Sleeper returned with code: ' + code);
});

// The different parameters of the 'exit' event depend on the manner of the
// child process's termination.
var interruptedSleeper = spawn('sleep', ['10']);
setTimeout(function () {
    // 'SIGTERM' is the default.
    interruptedSleeper.kill('SIGTERM');
}, 1000);
interruptedSleeper.on('exit', function (code, signal) {
    if (code !== null) {
        console.log('interruptedSleeper exited normally');
    } else if (signal) {
        console.log('interruptedSleeper terminated with signal ' + signal);
    } else {
        console.log('how did interruptedSleeper exit?');
    }
});

