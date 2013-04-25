var https = require('https');
var fs = require('fs');
var util = require('util');

var options = {
    key: fs.readFileSync('./pems/server_key.pem'),
    cert: fs.readFileSync('./pems/server_cert.pem'),
    // This requests a certificate from the client. This is not generally
    // needed since the important thing in most cases is that the server
    // can verify its authenticity to the client, not that the client can
    // verify the authenticity of their certificate to the server
    // (app-specific client authentication (e.g. user logins) is of course
    // essential, but that is something different).
    requestCert: true
};

var server = https.createServer(options, function (req, res) {
    console.log('authorized? ' + req.socket.authorized);
    console.log('client cert: ' +
                util.inspect(req.socket.getPeerCertificate()));
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hi there.\n');
});
server.listen(8008, function () {
    console.log('Listening on port ' + this.address().port);
});
