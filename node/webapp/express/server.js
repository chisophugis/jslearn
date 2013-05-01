var express = require('express');
var app = express();
var search = require('./search.js');

// Express will autodetect this. The purpose of the .engine() method I
// think is primarily to inform express that specific extensions should be
// treated as specific kinds of templates (e.g. that '.html' files contain
// ejs).
//app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
console.log(app.get('views'));
// Use NODE_ENV=production
app.configure('production', function () {
    console.log('In production');
    app.enable('view cache'); // equivalent: app.set('view cache', true);
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/search', function (req, res, next) {
    search(req.query.q, function (err, tweets) {
        if (err) { return next(err); }
        // Can also pass an `function (err, html) {}` callback as the last
        // arg to explicitly handle errors and to send the HTML yourself.
        // By default, on errors, express will call `next(err)` for you,
        // and on success it will respond with the rendered HTML.
        res.render('search', {
            results: tweets,
            search: req.query.q
        });
    });
});

// The arity-4 middlewares that are passed to .use() will be called in case
// of error. Not finding a path is not an error (e.g., to handle 404's,
// just put a regular middleware "last"). The "error" middlewares get
// called in case of thrown exceptions.
app.use(function (err, req, res, next) {
    if ('Bad twitter response' === err.message) {
        res.send(500, 'Twitter failed');
    } else {
        next();
    }
});

app.listen(8000);
