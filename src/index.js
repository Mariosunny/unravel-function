unravel = require('./unravel');

function foo(a, b, c) {
    return a - b + c;
}

foo = unravel(foo);

console.log(foo.a(5).c(4).b(3));