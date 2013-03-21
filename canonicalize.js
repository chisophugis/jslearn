// Foo
var esprima = require('esprima');

var options = {
    comment: true,
    range: true,
    loc: false
};


console.log(JSON.stringify(esprima.parse('var x;', options), null, 2));
