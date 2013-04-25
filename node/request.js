var request = require('request'),
    util = require('util');

// alias for request.get()
request('http://www.google.com', function (err, response, body) {
    if (err) { throw err; }
    console.log('response.body === body: %j', response.body === body);
});
// There is also request.put, request.post, request.head, request.del

// This is the "introspection echo" server from httpRequest.js
request('http://localhost:8002', function (err, response, body) {
    if (err) { throw err; }
    console.log('### vanilla:');
    console.log(body);
});

function printOpts(name, opts) {
    console.log('### %s:\n%s', name, util.inspect(opts));
}

var opts1 = {
    url: 'http://localhost:8002',
    method: 'DELETE'
};
request(opts1, function (err, response, body) {
    if (err) { throw err; }
    printOpts('opts1', opts1);
    console.log(body);
});

var opts2 = {
    url: 'http://localhost:8002',
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: new Buffer('Hello World!')
};
request(opts2, function (err, response, body) {
    if (err) { throw err; }
    printOpts('opts2', opts2);
    console.log(body);
});

var opts3 = {
    url: 'http://localhost:8002',
    json: {test: 'json request'}
};

request(opts3, function (err, response, body) {
    if (err) { throw err; }
    printOpts('opts3', opts3);
    console.log(body);
});

var opts4 = {
    url: 'http://localhost:8002',
    // It automatically will add `?a=foo&b=bar` to the URL
    qs: {a: 'foo', b: 'bar'}
};
request(opts4, function (err, response, body) {
    if (err) { throw err; }
    printOpts('opts4', opts4);
    console.log(body);
});


var opts5 = {
    url: 'http://localhost:8002',
    // It will automatically add it as an
    // `application/x-www-form-urlencoded; charset=utf-8` form request in
    // the body.
    form: {a: 'foo bar', b: 'baz'}
};
request(opts5, function (err, response, body) {
    if (err) { throw err; }
    printOpts('opts5', opts5);
    console.log(body);
});

// If no callback is provided, then it returns just the Request object (it
// is just a Stream, not an http.ClientRequest).
var Stream = require('stream').Stream;
var isAStream = request('http://localhost:8002') instanceof Stream;
console.log('request(url) is a Stream: ' + isAStream);
