var tls = require('tls');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./openssl/client_key.pem'),
    cert: fs.readFileSync('./openssl/client_cert.pem'),
    host: 'localhost',
    port: 4444,
    // "Authorization" means whether the certificate was able to be
    // verified against a Certificate Authority, so a self-signed
    // certificate (like the one used here for testing) doesn't authorize
    // for obvious reasons. The connection is still encrypted though.
    rejectUnauthorized: false
};

var cleartextStream = tls.connect(options, function () {
    if (this.authorized) {
        console.log('Yay, authorized connection!');
    } else {
        console.log('Unauthorized with error: ' +
                    cleartextStream.authorizationError);
    }
    process.stdin.pipe(this).pipe(process.stdout);
});

cleartextStream.on('error', function (err) {
    console.log(err.stack);
});
