import { binomialCoefficient, createFrequencyMap } from "./utils.mjs";

/**
 * Runs a MHD calculation for a given possible combination state
 * @param {Array<string>} siteDeck
 * @param {Array<string>} singlePossibleCombination
 * @param {number} drawCount
 * @returns {number} 
 */
function multivariateHypergeometricDistribution(siteDeck, singlePossibleCombination) {
  // Convert the string signature back into an array
  const revivedCombination = singlePossibleCombination.split(',');
  let numerator = 1;
  let cumulativeMatches = 0;
  const combinationSymbolsFrequencyMap = createFrequencyMap(revivedCombination);

  // For each symbol in combinationSymbolsFrequencyMap, determine the number of cards in the site deck that are an exact match.
  // This will be the top number in a binomial coefficient calculation.
  // desiredMatchCount is the corresponding frequency of that symbol.
  // Add the number of exactMatches to the running tally, then calculate the binomial coefficient and multiply it by the previous results (or 1, if it's the first)
  for (const key in combinationSymbolsFrequencyMap) {
    if (Object.prototype.hasOwnProperty.call(combinationSymbolsFrequencyMap, key)) {
      const exactMatches = siteDeck.filter((item) => item == key).length;
      const desiredMatchCount = combinationSymbolsFrequencyMap[key];
      cumulativeMatches += exactMatches;
      numerator = numerator * binomialCoefficient(exactMatches, desiredMatchCount);
    }
  }
  // The last item in the numerator of the MHD calculation is the binomial coefficient of the 'non-matches', if any
  // i.e. the rest of the deck in the top and zero in the bottom of a binomial coefficient calculation
  const finalSuccessState = siteDeck.length - cumulativeMatches;
  if(finalSuccessState > 0) {
    numerator = numerator * binomialCoefficient(finalSuccessState, 0);
  }
  // The denominator of the MHD calculation is a single binomial coefficient with the total site deck over the 'draw count', or number of symbols in the 
  // singlePossibleCombination array
  const denominator = binomialCoefficient(siteDeck.length, revivedCombination.length);

  const result = numerator / denominator;
  return result;
}

/**
 * Runs a MHD calculation on every possible success combination to find that particular probability, and adds them up for a resulting cumulative probability
 * @param {Array<string>} siteDeck
 * @param {Array<Array<string>>} allPossibleCombinations
 * @param {number} drawCount
 * @returns {number} 
 */
export function deriveProbability(siteDeck, allPossibleCombinations) {
  let cumulativeOdds = 0;
  for (let index = 0; index < allPossibleCombinations.length; index++) {
      cumulativeOdds += multivariateHypergeometricDistribution(siteDeck, allPossibleCombinations[index]);
  }
  return cumulativeOdds * 100;
}