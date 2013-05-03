var upnode = require('upnode');

var server = upnode(function (remote, conn) {
    this.auth = function (user, pass, cb) {
        var users = {
            foo: 'bar'
        };
        var p = users[user];
        if (p === pass) cb(null);
        else cb('ACCESS DENIED!');
    };
});
server.listen(Number(process.argv[2]));
