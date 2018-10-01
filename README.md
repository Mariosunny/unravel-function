## unravel-function
Takes a function and spreads its arguments across a chain of functions to be lazily evaluated, al la the [Builder Pattern](https://sourcemaking.com/design_patterns/builder).
```javascript
const unravel = require('unravel-function');

function func(foo, bar, qux) {
  return foo - bar + qux;
}

func = unravel(func);

var result = func
  .foo(5)
  .qux(8)
  .bar(3);

console.log(result); // prints 10 (5 - 3 + 8)
```

## Installation

```shell
$ npm install unravel-function --save
```

## Why Use It?
- It makes your function calls more readable- especially useful for functions with lots of arguments.
- It's lightweight. The unminified source code is less than 2 KB.

## Description
`unravel(func, params=undefined)`

Returns an object whose keys are the parameter names of `func` (unless overriden by `params`), and whose values are functions that take a single argument that fills the corresponding parameter. Once the last argument is filled (or when `eval()` is called), `func` is evaluated with the arguments and the result is returned.

#### Parameters
| Name | Type          | Default Value | Description                                         |
|-----------|---------------|---------------|-----------------------------------------------------|
| `func`      | Function      |               | The function to be called after the last argument has been filled, or when `eval()` is called.|
| `params`    | Array[String] | null          | _[Optional]_ An array of strings to override `func` parameter names. (See examples below)          |

## Examples

#### Overriding parameter names
```javascript
function foo(bar, baz, bux) {
  ...
}

// 'bezos' is mapped to the first argument, 'waldo' is mapped to the third argument
var chain = unravel(foo, ['bezos', null, 'waldo']);

// same as foo(1, 2, 3)
var result = chain.bezos(1).baz(2).waldo(3);
```

#### Additional parameter names
```javascript
function foo(bar, baz, bux) {
  ...
}

// 'qux' is mapped to the fourth argument
var chain = unravel(foo, [null, null, null, 'qux']);

// same as foo(1, 2, 3, 4)
var result = chain.bar(1).baz(2).bux(3).qux(4);
```

#### Short-circuit evaluation
```javascript
function foo(bar, baz, bux) {
  ...
}

foo = unravel(foo);

// same as foo(undefined, 5, undefined)
var result = foo.baz(5).eval();
```

## Note on ES6 Default Parameters
If you are working on an ES6 project that compiles into ES5 code using [Babel](https://www.npmjs.com/package/@babel/cli), `unravel-function` will be unable to automatically detect [ES6 default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters) in your compiled code. This is due to the way that ES6 implements default parameters. If you wish to unravel a function with ES6 default parameters, you will have to explicitly pass in the name of each parameter when calling `unravel`.

```javascript
const unravel = require('unravel-function');

// function with ES6 default parameters
function foo(a, b, c = 5) {
    ...
}

foo = unravel(foo, ['a', 'b', 'c']);
```


## About
This project is maintained by [Tyler Hurson](https://github.com/Mariosunny). Submit any issues or pull requests to the [official Github repo](https://github.com/Mariosunny/unravel-function).