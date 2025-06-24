import { createFrequencyMap } from "./utils.mjs";

/**
 * Calculates binomial coefficient; how many ways to choose k items from n items without repition or order
 * Taken from https://www.30secondsofcode.org/js/s/binomial-coefficient/
 * @param {number} n
 * @param {number} k
 * @returns {number} 
 */
function binomialCoefficient (n, k) {
  if (Number.isNaN(n) || Number.isNaN(k)) return NaN;
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;
  if (n - k < k) k = n - k;

  let res = n;
  for (let i = 2; i <= k; i++) res *= (n - i + 1) / i;
  return Math.round(res);
};


/**
 * Runs a MHD calculation for a given possible combination state
 * @param {Array<String>} siteDeck
 * @param {Array<String>} singlePossibleCombination
 * @param {number} drawCount
 * @returns {number} 
 */
function multivariateHypergeometricDistribution(siteDeck, singlePossibleCombination) {
  let numerator = 1;
  let cumulativeMatches = 0;
  const combinationSymbolsFrequencyMap = createFrequencyMap(singlePossibleCombination);

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
  const denominator = binomialCoefficient(siteDeck.length, singlePossibleCombination.length);

  const result = numerator / denominator;
  return result;
}

/**
 * Runs a MHD calculation on every possible success combination to find that particular probability, and adds them up for a resulting cumulative probability
 * @param {Array<String>} siteDeck
 * @param {Array<Array<String>>} allPossibleCombinations
 * @param {number} drawCount
 * @returns {number} 
 */
export function deriveProbability(siteDeck, allPossibleCombinations, drawCount) {
  let cumulativeOdds = 0;
  for (let index = 0; index < allPossibleCombinations.length; index++) {
      cumulativeOdds += multivariateHypergeometricDistribution(siteDeck, allPossibleCombinations[index]);
  }
  return cumulativeOdds * 100;
}

