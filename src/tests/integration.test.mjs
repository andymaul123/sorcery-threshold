import { generateCombinations } from "../recursive-combinator.mjs";
import { deriveProbability } from "../probability.mjs"; 
import { cleanTrailingFloatingPoint } from "../utils.mjs";
import { battlemageSiteDeck, battlemageCriteria, siteDeckFourCards, siteDeckWildCards } from './common.mjs';
import { simulateProbability } from "../simulation.mjs";

describe('Integration tests that use original criteria and corroborate derived against simulated probability', () => {
  test('Battlemage draw 3', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 3, false);
    const derivedProbability = deriveProbability(battlemageSiteDeck, combinations);
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 3);
    expect(combinations.length).toBe(60);
    expect(derivedProbability).toBe(27.142857142857135);
    expect(simulatedProbability).toBeGreaterThanOrEqual(26);
    expect(simulatedProbability).toBeLessThanOrEqual(28);
  });
  test('Battlemage draw 4', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 4, false);
    const derivedProbability = deriveProbability(battlemageSiteDeck, combinations);
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 4);
    expect(combinations.length).toBe(215);
    expect(derivedProbability).toBe(50.129538405400545);
    expect(simulatedProbability).toBeGreaterThanOrEqual(49);
    expect(simulatedProbability).toBeLessThanOrEqual(51);
  });
  test('Battlemage draw 5', async () => {
    const combinations = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 5, false);
    const derivedProbability = deriveProbability(battlemageSiteDeck, combinations);
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 5);
    expect(combinations.length).toBe(573);
    expect(derivedProbability).toBe(68.48764262557295);
    expect(simulatedProbability).toBeGreaterThanOrEqual(67);
    expect(simulatedProbability).toBeLessThanOrEqual(69);
  });
});
