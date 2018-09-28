export function getParameters(func) {
    let stripped = (func + '')
        .replace(/=[^,]+/mg, '')
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '')
        .replace(/=>.*$/mg, '');

    let result = stripped.slice(stripped.indexOf('(') + 1, stripped.indexOf(')')).match(/([^\s,]+)/g);

    return result === null ? []: result;
}

export function fillArray(size, value) {
    return Array.apply(null, Array(size)).map(function($) { return value; } );
}