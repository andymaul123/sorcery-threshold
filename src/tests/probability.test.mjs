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
  test('Original criteria draw 2', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 2, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(9);
    expect(probability).toBe(7.586206896551724);
  });
  test('Original criteria draw 3', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 3, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(60);
    expect(probability).toBe(27.142857142857135);
  });
  test('Original criteria draw 4', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 4, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(215);
    expect(probability).toBe(50.129538405400545);
  });
  test('Original criteria draw 5', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 5, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(573);
    expect(probability).toBe(68.48764262557295);
  });
  test('Original criteria draw 6', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 6, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(1264);
    expect(probability).toBe(80.767125594711);
  });
  test('Original criteria draw 7', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 7, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(combinations.length).toBe(2436);
    expect(probability).toBe(88.3867275763839);
  });
});