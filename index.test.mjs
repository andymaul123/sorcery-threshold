import { generateCombinations } from "./generate-combinations.mjs";
import { deriveProbability } from "./derive-probability.mjs";
import { simulateProbability } from "./simulate-probability.mjs";

const criteria = ['a', 'e', 'e', 'w'];

const siteDeckSymbols = [
  'a',   'a',  'a',  'a',  'a',
  'a',   'ae', 'ae', 'ae', 'aef',
  'aew', 'e',  'e',  'e',  'e',
  'e',   'e',  'e',  'e',  'e',
  'efw', 'ew', 'ew', 'ew', 'w',
  'w',   'w',  'x',  'x',  'x'
];

const originalDataProbability = 33.55592045247224;


describe('Basic control tests for the math behind deriveProbability', () => {
  test('Probablity of selecting a from a pool of a,e,f,w', () => {
    expect(deriveProbability(['a', 'e', 'f', 'w'], generateCombinations(['a'], ['a', 'e', 'f', 'w']))).toBe(25);
  });

  test('Probablity of selecting a from a pool of aew,aew,aew', () => {
    expect(deriveProbability(['aew', 'aew', 'aew'], generateCombinations(['a'], ['aew', 'aew', 'aew']))).toBe(100);
  });

  test('Probability of selecting x from a pool of a,e,f,w', () => {
    expect(deriveProbability(['a', 'e', 'f', 'w'], generateCombinations(['x'], ['a', 'e', 'f', 'w']))).toBe(0);
  });
});

describe('Basic control tests for simulating probability', () => {
  test('Probablity of selecting a from a pool of a,e,f,w', () => {
    const simulatedOutcome = simulateProbability(['a', 'e', 'f', 'w'], generateCombinations(['a'], ['a', 'e', 'f', 'w']), 1000, 1);
    expect(simulatedOutcome).toBeGreaterThanOrEqual(23);
    expect(simulatedOutcome).toBeLessThan(28);
  });

  test('Probablity of selecting a from a pool of aew,aew,aew', () => {
    expect(simulateProbability(['aew', 'aew', 'aew'], generateCombinations(['a'], ['aew', 'aew', 'aew']), 1000, 1)).toBe(100);
  });

  test('Probability of selecting x from a pool of a,e,f,w', () => {
    expect(simulateProbability(['a', 'e', 'f', 'w'], generateCombinations(['x'], ['a', 'e', 'f', 'w']), 1000, 1)).toBe(0);
  });
});

describe('Tests using the original data set', () => {
  test('default derive probability test', () => {
    const probabilityOutcome = deriveProbability(siteDeckSymbols, generateCombinations(criteria, siteDeckSymbols));
    expect(probabilityOutcome).toBe(originalDataProbability);
  });
  test('default simulate probability test', () => {
    const simulatedOutcome = simulateProbability(siteDeckSymbols, generateCombinations(criteria, siteDeckSymbols));
    expect(simulatedOutcome).toBeGreaterThanOrEqual(29);
    expect(simulatedOutcome).toBeLessThan(37);
  });
  test('default simulate probability test with draw 7', () => {
    const simulatedOutcome = simulateProbability(siteDeckSymbols, generateCombinations(criteria, siteDeckSymbols, 7), 1000, 7);
    expect(simulatedOutcome).toBeGreaterThanOrEqual(85);
    expect(simulatedOutcome).toBeLessThan(91);
  });
});






