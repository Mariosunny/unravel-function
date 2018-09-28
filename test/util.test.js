import {getParameters, fillArray} from '../src/util';

test('test getParameters()', () => {
    function func1() {}
    function func2(a) {}
    function func3(a, b, c) {}
    function func4(aaa, bbb, ccc=3) {}
    function func5(a = 5) {}
    function func6(a, /*b,*/ c) {}
    let func7 = () => {};
    let func8 = a => {};
    let func9 = (a) => {};
    let func10 = (a, b, c) => {};
    let func11 = (a, b, c = 5) => {};
    let func12 = new Function('a', 'b', 'return a + b');

    expect(getParameters(func1)).toEqual([]);
    expect(getParameters(func2)).toEqual(['a']);
    expect(getParameters(func3)).toEqual(['a', 'b', 'c']);
    expect(getParameters(func4)).toEqual(['aaa', 'bbb']);
    expect(getParameters(func5)).toEqual([]);
    expect(getParameters(func6)).toEqual(['a', 'c']);
    expect(getParameters(func7)).toEqual([]);
    expect(getParameters(func8)).toEqual(['a']);
    expect(getParameters(func9)).toEqual(['a']);
    expect(getParameters(func10)).toEqual(['a', 'b', 'c']);
    expect(getParameters(func11)).toEqual(['a', 'b']);
    expect(getParameters(func12)).toEqual(['a', 'b']);
});


test('test fillArray()', () => {
    expect(fillArray(0, null)).toEqual([]);
    expect(fillArray(1, null)).toEqual([null]);
    expect(fillArray(5, null)).toEqual([null, null, null, null, null]);
    expect(fillArray(1)).toEqual([undefined]);
    expect(fillArray(3, 0)).toEqual([0, 0, 0]);
    expect(fillArray(3, "foo")).toEqual(["foo", "foo", "foo"]);
});