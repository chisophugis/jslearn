var net = require('net');

var server = net.createServer();

var clients = [];

server.on('connection', function (socket) {
    clients.push(socket);
    socket.on('readable', function () {
        var data = this.read();
        clients.forEach(function (client) {
            if (client !== socket) {
                client.write(data);
            }
        });
        data = this.read()
        if (data !== null) {
            console.error('still more to read');
        }
    });
    socket.on('close', function (hadError) {
        var idx = clients.indexOf(socket);
        clients.splice(idx, 1);
    })
});

server.on('error', function (err) {
    console.log('Uh oh, an error:');
    console.log(err.stack);
});
server.on('close', function () {
    console.log('Server is finished.');
});

server.listen(8080);
