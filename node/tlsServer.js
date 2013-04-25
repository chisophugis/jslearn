var tls = require('tls');
var fs = require('fs');

var serverOptions = {
    key: fs.readFileSync('./openssl/server_key.pem'),
    cert: fs.readFileSync('./openssl/server_cert.pem'),
    // Use the client certificate as the CA, just to see how things work
    // when certificates are properly authenticated.
    ca: [fs.readFileSync('./openssl/client_cert.pem')],
    requestCert: true
};
// Optional second arg is a 'secureConnection' listener.
var server = tls.createServer(serverOptions);

server.on('secureConnection', function (cleartextStream) {
    console.log('server connected');
    if (cleartextStream.authorized) {
        console.log('authorized');
    } else {
        console.log('unauthorized');
    }
    cleartextStream.pipe(cleartextStream);
});

server.listen(4444);
