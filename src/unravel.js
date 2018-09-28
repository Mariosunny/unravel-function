/*
Main source code for the NPM module unravel-function, by Tyler Hurson. unravel-function takes a function and spreads
its arguments across a chain of functions to be lazily evaluated. See README.md for examples.

Github Repo:
https://github.com/Mariosunny/unravel-function
 */

import {getParameters, fillArray} from './util';

const UNFILLED_ARG = Symbol();

/**
 * Returns an object where each parameter name of func is mapped to a function that expects a single argument and then
 * returns another object, and so on until all arguments of func have been filled. On the last call in the chain, func
 * is evaluated with the provided arguments and returned. eval() can be called at any point in the chain, and will
 * evaluate func with the current arguments, with any remaining arguments set to undefined.
 *
 * @author Tyler Hurson
 * @param {function} func The function to be evaluated at the end of the chain or when eval() is called
 * @param {string[]=} [params=[]] A list of parameter names that override the parameter names of the function in the chain
 * @returns {Object} The unraveled function chain, or the origin function if the function has no parameters
 */
export default function unravel(func, params) {
    let funcParameters = getParameters(func);
    let overrideParams = params || [];

    validateFunc(func);
    validateParams(overrideParams);

    if(funcParameters.length === 0) {
        return func;
    }

    let numberOfArgs = Math.max(funcParameters.length, overrideParams.length);

    return unravelRecursive(
        func,
        funcParameters,
        overrideParams,
        fillArray(numberOfArgs, UNFILLED_ARG),
        numberOfArgs
    );
}

function unravelRecursive(func, functionParams, overrideParams, args, argsToGo) {
    if(argsToGo > 0) {
        let obj = {
            eval: function() {
                return callFunc(func, args);
            }
        };

        args.forEach(function(arg, i) {
            if(arg === UNFILLED_ARG) {
                let paramName = getParamName(i, functionParams, overrideParams);
                obj[paramName] = function (arg) {
                    let newArgs = args.slice(0);
                    newArgs[i] = arg;
                    return unravelRecursive(func, functionParams, overrideParams, newArgs, argsToGo - 1);
                }
            }
        });

        return obj;
    }
    else {
        return callFunc(func, args);
    }
}

function callFunc(func, args) {
    return func.apply(null, normalizeArgs(args));
}

function normalizeArgs(args) {
    return args.map(function(arg) {
        if(arg === UNFILLED_ARG) {
            return undefined;
        }
        return arg;
    });
}

function getParamName(i, functionParams, overrideParams) {
    if(i < overrideParams.length && typeof overrideParams[i] === 'string') {
        return overrideParams[i];
    }
    return functionParams[i];
}

function validateFunc(func) {
    if(func === undefined) {
        throw new Error("first argument required");
    }
    if(typeof func !== 'function') {
        throw new Error("first argument must be a function")
    }
}

function validateParams(params) {
    if(!Array.isArray(params)) {
        throw new Error("second argument must be an array");
    }
}