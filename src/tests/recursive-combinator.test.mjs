import { generateCombinations, shouldResetPointers } from '../recursive-combinator.mjs';

const siteDeckThirtyCards = ['a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e','f','w','a','e'];
const siteDeckFourCards = ['a', 'e', 'f', 'w'];
const siteDeckWildCards = ['aef', 'aew','aefw', 'x', 'y'];
const battlemageSiteDeck = [
  'a',   'a',  'a',  'a',  'a',
  'a',   'ae', 'ae', 'ae', 'aef',
  'aew', 'e',  'e',  'e',  'e',
  'e',   'e',  'e',  'e',  'e',
  'efw', 'ew', 'ew', 'ew', 'w',
  'w',   'w',  'x',  'x',  'x'
];
const battlemageCriteria = ['a','e','e','w'];

describe('Basic control tests for generating combinations with filtering', () => {
  test('Generate combinations: 1 out of 4 match', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 1, false);
    expect(combinations).toStrictEqual(['a']);
  });
  test('Generate combinations: 4 out of 4 match', async () => {
    const combinations = await generateCombinations(['a', 'ae', 'af', 'aw'], ['a'], 1, false);
    expect(combinations).toStrictEqual(['a','ae','af','aw']);
  });
  test('Generate combinations: 1 out of 1 match', async () => {
    const combinations = await generateCombinations(['aefw'], ['a'], 1, false);
    expect(combinations).toStrictEqual(['aefw']);
  });
  test('Generate combinations: one Pristine Paradise, all 4 threshold', async () => {
    const combinations = await generateCombinations(['aefw'], ['a','e','f','w'], 1); 
    expect(combinations).toStrictEqual(['aefw']);
  });
  test('Generate combinations: 3 out of 6 match', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 2, false);
    expect(combinations).toStrictEqual(['a,e','a,f','a,w']);
  });
  test('Generate combinations: threshold is met with wildcards draw 1', async () => {
    const combinations = await generateCombinations(siteDeckWildCards, ['a','e','e','w'], 1, false);
    expect(combinations).toStrictEqual([]);
  });
  test('Generate combinations: threshold is met with wildcards draw 2', async () => {
    const combinations = await generateCombinations(siteDeckWildCards, ['a','e','e','w'], 2, false);
    expect(combinations).toStrictEqual(["aef,aew","aef,aefw","aew,aefw"]);
  });
  test('Generate combinations: threshold is met with wildcards draw 3', async () => {
    const combinations = await generateCombinations(siteDeckWildCards, ['a','e','e','w'], 3, false);
    expect(combinations).toStrictEqual(["aef,aew,aefw","aef,aew,x","aef,aew,y","aef,aefw,x","aef,aefw,y","aew,aefw,x","aew,aefw,y"]);
  });
});

describe('Basic control tests for generating combinations without filtering - length', () => {
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

describe('Basic control tests for generating combinations without filtering - combination array', () => {
  test('Generates correct combinations 6 draw 1', async () => {
    const combinations = await generateCombinations(['a', 'b','c', 'd', 'e', 'f'], ['a'], 1, true);
    expect(combinations.length).toBe(6);
    expect(combinations).toStrictEqual(["a","b","c","d","e","f",]);
  });
  test('Generates correct combinations 6 draw 2', async () => {
    const combinations = await generateCombinations(['a', 'b','c', 'd', 'e', 'f'], ['a'], 2, true);
    expect(combinations.length).toBe(15);
    expect(combinations).toStrictEqual(["a,b","a,c","a,d","a,e","a,f","b,c","b,d","b,e","b,f","c,d","c,e","c,f","d,e","d,f","e,f"]);
  });
  test('Generates correct combinations 6 draw 3', async () => {
    const combinations = await generateCombinations(['a', 'b','c', 'd', 'e', 'f'], ['a'], 3, true);
    expect(combinations.length).toBe(20);
    expect(combinations).toStrictEqual(["a,b,c","a,b,d","a,b,e","a,b,f","a,c,d","a,c,e","a,c,f","a,d,e","a,d,f","a,e,f","b,c,d","b,c,e","b,c,f","b,d,e","b,d,f","b,e,f","c,d,e","c,d,f","c,e,f","d,e,f"]);
  });
  test('Generates correct combinations 5 draw 3', async () => {
    const combinations = await generateCombinations(['a', 'b','c', 'd', 'e'], ['a'], 3, true);
    expect(combinations.length).toBe(10);
    expect(combinations).toStrictEqual(["a,b,c","a,b,d","a,b,e","a,c,d","a,c,e","a,d,e","b,c,d","b,c,e","b,d,e","c,d,e"]);
  });
});

describe('Tests using the original data set', () => {
  test('', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 1, true);
    expect(combinations.length).toBe(30);
    expect(combinations).toStrictEqual(['a','a','a','a','a','a','ae','ae','ae','aef','aew','e','e','e','e','e','e','e','e','e','efw','ew','ew','ew','w','w','w','x','x','x']);
  });
});

describe('Tests pointer reset logic', () => {
  test('Returns false', () => {
    expect(shouldResetPointers([0,1,2], 2, 5)).toBe(false);
  });
  test('Returns false', () => {
    expect(shouldResetPointers([0,1,3], 2, 5)).toBe(false);
  });
  test('Returns false', () => {
    expect(shouldResetPointers([0,1,4], 2, 5)).toBe(true);
  });
  test('Returns false', () => {
    expect(shouldResetPointers([0,2,3], 1, 5)).toBe(false);
  });
  test('Returns false', () => {
    expect(shouldResetPointers([0,2,4], 1, 5)).toBe(false);
  });
  test('Returns true', () => {
    expect(shouldResetPointers([0,3,4], 1, 5)).toBe(true);
  });
  test('Returns false', () => {
    expect(shouldResetPointers([1,2,3], 2, 5)).toBe(false);
  });
  test('Returns true', () => {
    expect(shouldResetPointers([1,2,4], 2, 5)).toBe(true);
  });
  test('Returns true', () => {
    expect(shouldResetPointers([1,3,4], 1, 5)).toBe(true);
  });
  test('Returns true', () => {
    expect(shouldResetPointers([2,3,4], 0, 5)).toBe(true);
  });
});