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
  .bar(3); // arguments can be chained in any order

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
const unravel = require('unravel-function');

function foo(bar, baz, bux) {
  ...
}

let fooWith = unravel(foo, ['bezos', null, 'waldo']);

var result = fooWith
  .bezos(1) // maps to 'bar' parameter
  .baz(2)
  .waldo(3); // maps to 'bux' parameter
```

#### Grouping arguments
```javascript
const unravel = require('unravel-function');

function employeeStats(firstName, lastName, ssn) {
  ...
}

// groups the first and second parameters into a single function 'fullName' in the chain
employeeStats = unravel(employeeStats, ['fullName', 'fullName', null] );

let result = employeeStats.fullName("Henry", "Harper").ssn("000-00-0000");
```

#### Optional arguments
```javascript
const unravel = require('unravel-function');

function createStudent(name, age, major) {
  ...
}

createStudent = unravel(foo);

// immediately evaluates the function with the current arguments
// name, major are passed in as undefined
var result = createStudent.age(23).eval();
```