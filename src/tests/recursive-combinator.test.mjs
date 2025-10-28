import { generateCombinations } from '../recursive-combinator.mjs';

const siteDeckThirtyCards = ['a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e'];
const siteDeckFourCards = ['a', 'e', 'f', 'w'];

describe('Basic control tests for generating combinations with filtering', () => {
  test('Generate combinations: 1 out of 4 match', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 1, false);
    expect(combinations).toStrictEqual([['a']]);
  });
  test('Generate combinations: 4 out of 4 match', async () => {
    const combinations = await generateCombinations(['a', 'ae', 'af', 'aw'], ['a'], 1, false);
    expect(combinations).toStrictEqual([['a'],['ae'],['af'],['aw']]);
  });
  test('Generate combinations: 1 out of 1 match', async () => {
    const combinations = await generateCombinations(['aefw'], ['a'], 1, false);
    expect(combinations).toStrictEqual([['aefw']]);
  });
  test('Generate combinations: one Pristine Paradise, all 4 threshold', async () => {
    const combinations = await generateCombinations(['aefw'], ['a','e','f','w'], 1); 
    expect(combinations).toStrictEqual([['aefw']]);
  });
  test('Generate combinations: 3 out of 6 match', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 2, false);
    expect(combinations).toStrictEqual([['a','e'],['a','f'],['a','w']]);
  });
});

describe('Basic control tests for generating combinations without filtering', () => {
  test('Generate total possible combinations: 4 draw 1', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 1, true);
    expect(combinations.length).toStrictEqual(4);
  });
  test('Generate total possible combinations: 4 draw 2', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 2, true);
    expect(combinations.length).toStrictEqual(6);
  });
  test('Generate total possible combinations: 30 draw 1', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 1, true);
    expect(combinations.length).toStrictEqual(30);
  });
  test('Generate total possible combinations: 30 draw 2', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 2, true);
    expect(combinations.length).toStrictEqual(435);
  });
  test('Generate total possible combinations: 30 draw 3', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 3, true);
    expect(combinations.length).toStrictEqual(4060);
  });
  test('Generate total possible combinations: 30 draw 4', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 4, true);
    expect(combinations.length).toStrictEqual(27405);
  });
  test('Generate total possible combinations: 30 draw 5', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 5, true);
    expect(combinations.length).toStrictEqual(142506);
  });
  test('Generate total possible combinations: 30 draw 6', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 6, true);
    expect(combinations.length).toStrictEqual(593775);
  });
  test('Generate total possible combinations: 30 draw 7', async () => {
    const combinations = await generateCombinations(siteDeckThirtyCards, ['a'], 7, true);
    expect(combinations.length).toStrictEqual(2035800);
  });
});