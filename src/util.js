// Credit: https://stackoverflow.com/a/31194949/2301287
export function getParameters(func) {
    return (func + '')
        .replace(/[/][/].*$/mg,'')
        .replace(/\s+/g, '')
        .replace(/[/][*][^/*]*[*][/]/g, '')
        .split('){', 1)[0].replace(/^[^(]*[(]/, '')
        .replace(/=[^,]+/g, '')
        .split(',').filter(Boolean);
}

export function fillArray(size, value) {
    return Array.apply(null, Array(size)).map(function($) { return value; } );
}