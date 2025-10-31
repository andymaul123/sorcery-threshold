import { generateCombinations } from "../recursive-combinator.mjs";
import { deriveProbability } from "../probability.mjs"; 
import { cleanTrailingFloatingPoint } from "../utils.mjs";

const siteDeckFourCards = ['a', 'e', 'f', 'w'];
const battlemageSiteDeck = [
  'a',   'a',  'a',  'a',  'a',
  'a',   'ae', 'ae', 'ae', 'aef',
  'aew', 'e',  'e',  'e',  'e',
  'e',   'e',  'e',  'e',  'e',
  'efw', 'ew', 'ew', 'ew', 'w',
  'w',   'w',  'x',  'x',  'x'
];
const battlemageCriteria = ['a','e','e','w'];
const siteDeckWildCards = ['aef', 'aew','aefw', 'x', 'y'];


describe('Basic control tests for deriving probability', () => {
  test('One in four, 25%', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 1, false);
    const probability = deriveProbability(siteDeckFourCards, combinations);
    expect(probability).toStrictEqual(25);
  });
  test('Two in four, 50%', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 2, false);
    const probability = deriveProbability(siteDeckFourCards, combinations);
    expect(probability).toStrictEqual(50);
  });
  test('Three in four, 75%', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 3, false);
    const probability = deriveProbability(siteDeckFourCards, combinations);
    expect(probability).toStrictEqual(75);
  });
  test('Three in four, 100%', async () => {
    const combinations = await generateCombinations(siteDeckFourCards, ['a'], 4, false);
    const probability = deriveProbability(siteDeckFourCards, combinations);
    expect(probability).toStrictEqual(100);
  });
});

describe('Probability with wildcard combinations', () => {
  test('5 draw 2, single criteria: 30%', async () => {
    const combinations = await generateCombinations(siteDeckWildCards, ['a','e','e','w'], 2, false);
    const probability = deriveProbability(siteDeckWildCards, combinations);
    expect(cleanTrailingFloatingPoint(probability)).toStrictEqual("30.0");
  });
  test('5 draw 3, single criteria: 70%', async () => {
    const combinations = await generateCombinations(siteDeckWildCards, ['a','e','e','w'], 3, false);
    const probability = deriveProbability(siteDeckWildCards, combinations);
    expect(cleanTrailingFloatingPoint(probability)).toStrictEqual("70.0");
  });
});

describe('Original Battlemage requirements', () => {
  // The probability math was done by hand & calculator to corroborate
  test('Original criteria draw 2', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 2, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(33);
    expect(probability).toBe(46.20689655172413);
  });
  // The rest of these were not corroborated by hand math
  test('Original criteria draw 3', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 3, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(1102);
    expect(probability).toBe(0);
  });

});