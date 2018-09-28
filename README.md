## unravel-function
Takes a function and spreads its arguments across a chain of functions to be lazily evaluated.
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

## Description
`unravel(func, params=undefined)`

Returns an object where each parameter name of `func` is mapped to a function that expects a single argument and then returns another object, and so on until all arguments of `func` have been filled. On the last call in the chain, `func` is evaluated with the provided arguments and returned. `eval()` can be called at any point in the chain, and will evaluate `func` with the current arguments, with any remaining arguments set to _undefined_.

#### Parameters
| Name | Type          | Default Value | Description                                         |
|-----------|---------------|---------------|-----------------------------------------------------|
| `func`      | Function      |               | The function to be called at the end of the chain, or when `eval()` is called.|
| `params`    | Array[String] | null          | _[Optional]_ An array of strings to override `func` parameter names. (See examples below)          |

## Examples

#### Overriding parameter names
```javascript
function foo(bar, baz, bux) {
  ...
}

// 'bezos' is mapped to the first argument, 'waldo' is mapped to the third argument
let chain = unravel(foo, ['bezos', null, 'waldo']);

// same as foo(1, 2, 3)
var result = chain.bezos(1).baz(2).waldo(3);
```

#### Additional parameter names
```javascript
function foo(bar, baz, bux) {
  ...
}

// 'qux' is mapped to the fourth argument
let chain = unravel(foo, [null, null, null, 'qux']);

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

// function with ES6 optional parameters
function foo(a, b, c = 5) {
    ...
}

foo = unravel(foo, ['a', 'b', 'c']);
```


## About
This project is maintained by [Tyler Hurson](https://github.com/Mariosunny). Submit any issues or pull requests to the [official Github repo](https://github.com/Mariosunny/unravel-function).