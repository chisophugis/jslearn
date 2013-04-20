var path = require('path');


// --> '../bar'
console.log(path.normalize('foo/..//../bar'));
// --> 'foo'
console.log(path.normalize('./foo'));

// --> 'foo/bar/baz'
console.log(path.join('foo', 'bar', 'baz'));
// --> 'baz', since path.join normalizes the too
console.log(path.join('foo', '..', 'baz'));

// Basically equivalent to
// $ cd foo
// $ cd bar
// $ cd ./baz
// $ pwd
// except that it is done without consulting the filesystem in any way,
// with the exception that the process's current working directory is
// prepended to relative paths.
console.log(path.resolve('foo', 'bar', './baz'));

// --> 'baz'
// Find a relative path to the second argument, starting at the first.
console.log(path.relative('/foo/bar/', '/foo/bar/baz'));
// Note that:
// path.resolve(from, path.relative(from, to)) === path.resolve(to)

var p = '/foo/bar/baz/quux.txt';
console.log(path.dirname(p));
console.log(path.basename(p));
// Strip the extension.
console.log(path.basename(p, '.txt'));
console.log(path.extname(p)); // --> '.txt'


console.log(path.sep); // --> '/' on *nix
console.log('foo/bar/baz'.split(path.sep));
// --> ':' on *nix
// The PATH delimiter.
console.log(path.delimiter);
console.log(process.env.PATH.split(path.delimiter));
