var connect = require('connect');
var app = connect();
var blog = connect();
app.use('/blog', blog);
var admin = connect();
blog.use('/admin', admin);
// Visit at /blog/admin
admin.use(function (req, res /*, next*/) {
    res.end('Hi');
});
app.listen(8000);
