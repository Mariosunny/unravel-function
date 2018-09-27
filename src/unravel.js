import util from './util';

const UNFILLED_ARG = Symbol();

function unravel(func, params) {
    let funcParameters = util.getParamters(func);
    params = params || [];
    return unravelRecursive(
        func,
        funcParameters,
        params,
        util.fillArray(funcParameters.length, UNFILLED_ARG),
        funcParameters.length
    );
}

function unravelRecursive(func, functionParams, overrideParams, args, argsToGo) {
    if(argsToGo > 0) {
        let obj = {
            eval: function() {
                return func.apply(null, normalizeArgs(args));
            }
        };

        args.forEach(function(arg, i) {
            if(arg === UNFILLED_ARG) {
                let paramName = getParamName(i, functionParams, overrideParams);
                obj[paramName] = function (arg) {
                    args[i] = arg;
                    return unravelRecursive(func, functionParams, overrideParams, args, argsToGo - 1);
                }
            }
        });

        return obj;
    }
    else {
        return func.apply(null, normalizeArgs(args));
    }
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

export default unravel;