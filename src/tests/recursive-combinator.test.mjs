import { generateCombinations } from '../recursive-combinator.mjs';

describe('Basic control tests for generating combinations with filtering', () => {
  test('Generate combinations: 1 out of 4 match', () => {
    expect(generateCombinations(['a', 'e', 'f', 'w'], ['a'], 1, false)).toStrictEqual([['a']]);
  });
  test('Generate combinations: 4 out of 4 match', () => {
    expect(generateCombinations(['a', 'ae', 'af', 'aw'], ['a'], 1, false)).toStrictEqual([['a'],['ae'],['af'],['aw']]);
  });
  test('Generate combinations: 1 out of 1 match', () => {
    expect(generateCombinations(['aefw'], ['a'], 1, false)).toStrictEqual([['aefw']]);
  });
  test('Generate combinations: one Pristine Paradise, all 4 threshold', () => {
    expect(generateCombinations(['aefw'], ['a','e','f','w'], 1)).toStrictEqual([['aefw']]);
  });
  test('Generate combinations: 3 out of 6 match', () => {
    expect(generateCombinations(['a', 'e', 'f', 'w'], ['a'], 2, false)).toStrictEqual([['a','e'],['a','f'],['a','w']]);
  });
});

describe('Basic control tests for generating combinations without filtering', () => {
  test('Generate total possible combinations: 4 draw 1', () => {
    expect(generateCombinations(['a', 'e', 'f', 'w'], ['a'], 1, true).length).toStrictEqual(4);
  });
  test('Generate total possible combinations: 4 draw 2', () => {
    expect(generateCombinations(['a', 'e', 'f', 'w'], ['a'], 2, true).length).toStrictEqual(6);
  });
  test('Generate total possible combinations: 30 draw 1', () => {
    expect(generateCombinations(['a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e'], ['a'], 1, true).length).toStrictEqual(30);
  });
  test('Generate total possible combinations: 30 draw 2', () => {
    expect(generateCombinations(['a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e', 'f', 'w','a', 'e'], ['a'], 2, true).length).toStrictEqual(435);
  });
});