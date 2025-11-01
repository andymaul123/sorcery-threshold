import { cleanTrailingFloatingPoint, binomialCoefficient, createInitialPointerArray, createFrequencyMap, extractStringSection, combinationValidator } from "../utils.mjs";

describe('Tests for binomialCoefficient', () => {
  test('binomialCoefficient returns 2 combinations from 2/1', () => {
    expect(binomialCoefficient(2,1)).toBe(2);
  });
  test('binomialCoefficient returns 20 combinations from 6/3', () => {
    expect(binomialCoefficient(6,3)).toBe(20);
  });
  test('binomialCoefficient returns 4060 combinations from 30/3', () => {
    expect(binomialCoefficient(30,3)).toBe(4060);
  });
  test('binomialCoefficient returns 27405 combinations from 30/4', () => {
    expect(binomialCoefficient(30,4)).toBe(27405);
  });
});

describe('Tests for createInitialPointerArray', () => {
  test('createInitialPointerArray returns an empty array when drawCount is 0', () => {
    expect(createInitialPointerArray(0)).toStrictEqual([]);
  });
  test('createInitialPointerArray correctly creates an array from draw 1', () => {
    expect(createInitialPointerArray(1)).toStrictEqual([0]);
  });
  test('createInitialPointerArray correctly creates an array from draw 2', () => {
    expect(createInitialPointerArray(2)).toStrictEqual([0,1]);
  });
  test('createInitialPointerArray correctly creates an array from draw 3', () => {
    expect(createInitialPointerArray(3)).toStrictEqual([0,1,2]);
  });
});

describe('Tests for createFrequencyMap', () => {
  test('createFrequencyMap correctly creates a map', () => {
    expect(createFrequencyMap(['a','b','c'])).toStrictEqual({"a": 1, "b": 1, "c": 1});
  });
  test('createFrequencyMap correctly creates a map with multiple values', () => {
    expect(createFrequencyMap(['a','b','c','a'])).toStrictEqual({"a": 2, "b": 1, "c": 1});
  });
  test('createFrequencyMap returns an empty object when input is empty', () => {
    expect(createFrequencyMap([])).toStrictEqual({});
  });
});

describe('Tests for cleanTrailingFloatingPoint', () => {
  test('cleanTrailingFloatingPoint correctly clips a long floating point value', () => {
    expect(cleanTrailingFloatingPoint(33.33333333333333)).toBe('33.3');
  });
  test('cleanTrailingFloatingPoint adds suffix on evenly rounded numbers', () => {
    expect(cleanTrailingFloatingPoint(33)).toBe('33.0');
  });
});

describe('Tests for extractStringSection', () => {
  test('extractStringSection correctly extracts "c"', () => {
    expect(extractStringSection('abcdef', 2)).toBe('abdef');
  });
  test('extractStringSection correctly extracts "a" at the start of the string', () => {
    expect(extractStringSection('abcdef', 0)).toBe('bcdef');
  });
  test('extractStringSection correctly extracts "f" at the end of the string', () => {
    expect(extractStringSection('abcdef', 5)).toBe('abcde');
  });
});

describe('Tests combination validator logic', () => {
  test('Threshold is not met', () => {
    expect(combinationValidator('aefw,x,y', battlemageCriteria)).toBe(false);
  });
  test('Criteria meets its own threshold', () => {
    expect(combinationValidator('a,e,e,w', battlemageCriteria)).toBe(true);
  });
  test('Criteria is met with extras', () => {
    expect(combinationValidator('a,ef,ae,x,y,wf', battlemageCriteria)).toBe(true);
  });
});