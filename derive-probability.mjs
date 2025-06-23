// Taken from https://www.30secondsofcode.org/js/s/binomial-coefficient/
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
// Runs a MHD calculation for a given possible combination state
function multivariateHypergeometricDistribution(siteDeck, singlePossibleCombination) {
  let numerator = 1;
  let cumulativeMatches = 0;
  let mhdSetSymbols = {};
  // For each item in a given singlePossibleCombination example,
  // construct a 'mhdSetSymbols' object with keys equal to the card symbol and value equal to the number of cards
  // of that type in this combination
  // Examples: {'a': 1, 'e': 2, 'w': 1} or {'ae':1,'aef':1,'e':1,'w':1}
  for (let index = 0; index < singlePossibleCombination.length; index++) {
      if(!mhdSetSymbols.hasOwnProperty(singlePossibleCombination[index])) {
        mhdSetSymbols[singlePossibleCombination[index]] = singlePossibleCombination.filter((letter) => letter == singlePossibleCombination[index]).length;
      }
  }

  // For each item in newly constructed mhdSetSymbols object,
  // determine the number of cards in the site deck match that exact representation and call it 'exactMatches'
  // This will be the top number in a binomial coefficient calculation
  // desiredMatchCount is the corresponding number value in the mhdSetSymbols object
  // Add the number of exactMatches to the running tally
  // Then calculate the binomial coefficient and multiply it by the previous results (or 1, if it's the first)
  for (const key in mhdSetSymbols) {
    if (Object.prototype.hasOwnProperty.call(mhdSetSymbols, key)) {
      const exactMatches = siteDeck.filter((item) => item == key).length;
      const desiredMatchCount = mhdSetSymbols[key];
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

export function deriveProbability(siteDeck, allPossibleCombinations, drawCount) {
  // For every possible combination of successes, run a MHD calculation to determine 
  // the odds of that specific success, and add it to the overall cumulative odds
  console.log(`Deriving probability...`);
  let cumulativeOdds = 0;
  for (let index = 0; index < allPossibleCombinations.length; index++) {
      cumulativeOdds += multivariateHypergeometricDistribution(siteDeck, allPossibleCombinations[index]);
  }
  return cumulativeOdds * 100;
}

