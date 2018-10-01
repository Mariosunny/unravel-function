const UNFILLED_ARG = Symbol();

export default function unravel(func, params) {
    let funcParameters = getParameters(func);
    params = params || [];

    if(typeof func !== 'function') {
        throw new Error("first argument must be a function")
    }
    if(!Array.isArray(params)) {
        throw new Error("second argument must be an array");
    }
    if(funcParameters.length === 0) {
        return func;
    }

    let filledArgs = 0;
    let chain = {};
    let paramsLength = Math.max(funcParameters.length, params.length);
    let args = getUnfilledArgs(paramsLength);

    for(let i = 0; i < paramsLength; i++) {
        let param = funcParameters[i];

        if(i < params.length && typeof params[i] === 'string') {
            param = params[i];
        }

        chain[param] = function(arg) {
            if(args[i] === UNFILLED_ARG) {
                filledArgs++;
            }

            args[i] = arg;

            if(filledArgs === paramsLength) {
                return chain.eval();
            }
            return chain;
        };
    }

    chain.eval = function() {
        let result = func.apply(null, args.map(function(arg) {
            return arg === UNFILLED_ARG ? undefined: arg;
        }));
        args = getUnfilledArgs(paramsLength);
        filledArgs = 0;
        return result;
    };

    return chain;
}

function getUnfilledArgs(length) {
    return Array.apply(null, Array(length)).map(function() { return UNFILLED_ARG; } );
}

function getParameters(func) {
    let stripped = (func + '')
        .replace(/=[^,]+/mg, '')
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '')
        .replace(/=>.*$/mg, '');

    let result = stripped.slice(stripped.indexOf('(') + 1, stripped.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? []: result;
}