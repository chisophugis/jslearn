var incr = 1;
process.on('SIGUSR1', function () {
    incr += 1;
});


process.stdin.resume();
process.stdin.on('data', function (data) {
    try {
        // FIXME: Assumes data arrives line-buffered
        var number = parseInt(data.toString(), 10);
        number += incr;
        process.stdout.write(number + '\n');
    } catch (err) {
        process.stderr.write(err.message + '\n');
    }
});
