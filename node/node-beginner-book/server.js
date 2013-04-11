var http = require('http');

http.createServer(function (request, response) {
    response.writeHead({'Content-Type': 'text/plain'});
    response.write('Hello from the server!');
    response.end();
}).listen(8888);
