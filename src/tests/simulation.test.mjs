import { simulateProbability } from "../simulation.mjs";
import { battlemageSiteDeck, battlemageCriteria } from './common.mjs';

describe('Original Battlemage requirements', () => {
  test('Original criteria draw 2', async () => {
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 2);
    expect(simulatedProbability).toBeGreaterThanOrEqual(6);
    expect(simulatedProbability).toBeLessThanOrEqual(8);
  });
  test('Original criteria draw 3', async () => {
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 3);
    expect(simulatedProbability).toBeGreaterThanOrEqual(26);
    expect(simulatedProbability).toBeLessThanOrEqual(28);
  });
  test('Original criteria draw 4', async () => {
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 4);
    expect(simulatedProbability).toBeGreaterThanOrEqual(49);
    expect(simulatedProbability).toBeLessThanOrEqual(51);
  });
  test('Original criteria draw 5', async () => {
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 5);
    expect(simulatedProbability).toBeGreaterThanOrEqual(67);
    expect(simulatedProbability).toBeLessThanOrEqual(69);
  });
  test('Original criteria draw 6', async () => {
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 6);
    expect(simulatedProbability).toBeGreaterThanOrEqual(79);
    expect(simulatedProbability).toBeLessThanOrEqual(81);
  });
  test('Original criteria draw 7', async () => {
    const simulatedProbability = simulateProbability(battlemageSiteDeck, battlemageCriteria, 7);
    expect(simulatedProbability).toBeGreaterThanOrEqual(87);
    expect(simulatedProbability).toBeLessThanOrEqual(89);
  });
});