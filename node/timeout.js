var timeoutCookie = setTimeout(function () {
    console.log('I will not be called because the timeout will be canceled.');
}, 1000);
clearTimeout(timeoutCookie);
// Note that it wouldn't be called even if the timeout were 0 ms because
// the clearTimeout is called before returning to the event loop.

process.nextTick(function () {
    console.log('Next tick');
});

// Similar to process.nextTick, but yields to the event loop after each
// callback instead of calling process.maxTickDepth of them before yielding
// back to the event loop. This means that setImmediate avoids starving IO.
//
// You can also pass in arguments to it (doesn't make much sense for an
// anonymous function; just use closure instead).
setImmediate(function (a, b) {
    console.log('Val: '  + String(a + b));
}, 3, 4);

// Avoid using setInterval when you want a time period *between* the end of
// a function and it starting again. Instead, use a "tail setTimeout".
// Otherwise, your function may finish after the next invocation due to
// setInterval was supposed to start, and it might be invoked *immediately*
// again (or multiple calls could end up accumulating if things get delayed
// enough).
