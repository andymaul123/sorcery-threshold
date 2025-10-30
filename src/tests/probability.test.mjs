import { generateCombinations } from "../recursive-combinator.mjs";
import { deriveProbability } from "../probability.mjs"; 

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

describe('Original Battlemage requirements', () => {
  // This value was compared against previous implementations and simulations and locked in as a test
  test('Original criteria, opening hand', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 3, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(probability).toStrictEqual(34.950738916256135);
  });
  // TODO: Something has gone wrong here, these are not giving the expected probability
  // The probability is going down instead of up by roughly an equivalent amount
  test('Original criteria, mulligan 1 site', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 4, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(probability).toStrictEqual(64);
  });
  test('Original criteria, mulligan 2 sites', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 5, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(probability).toStrictEqual(64);
  });
  test('Original criteria, mulligan all 3 sites', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 6, false);
    const probability = deriveProbability(battlemageSiteDeck, combinations);
    expect(probability).toStrictEqual(64);
  });
});