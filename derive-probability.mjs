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

function multivariateHypergeometricDistribution(siteDeck, possibleCombinations) {
  let numerator = 1;
  let cumulativeSuccessStates = 0;
  let mhdSetSymbols = {};
  for (let index = 0; index < possibleCombinations.length; index++) {
      if(!mhdSetSymbols.hasOwnProperty(possibleCombinations[index]))
      mhdSetSymbols[possibleCombinations[index]] = possibleCombinations.filter((letter) => letter == possibleCombinations[index]).length
  }

  // The number of binomial coefficients in the numerator is equal to the unique items in the array + 1

  for (const key in mhdSetSymbols) {
    if (Object.prototype.hasOwnProperty.call(mhdSetSymbols, key)) {
      const successStates = siteDeck.filter((item) => item == key).length;
      const observedSuccesses = mhdSetSymbols[key];
      cumulativeSuccessStates += successStates;
      numerator = numerator * binomialCoefficient(successStates, observedSuccesses);
    }
  }
  const finalSuccessState = siteDeck.length - cumulativeSuccessStates;
  if(finalSuccessState > 0) {
    numerator = numerator * binomialCoefficient(finalSuccessState, 0);
  }
  const denominator = binomialCoefficient(siteDeck.length, possibleCombinations.length);

  const result = numerator / denominator;
  return result;
}

export function deriveProbability(siteDeck, possibleCombinations) {
  console.log(`Deriving probability...`);
  let cumulativeOdds = 0;
  for (let index = 0; index < possibleCombinations.length; index++) {
      cumulativeOdds += multivariateHypergeometricDistribution(siteDeck, possibleCombinations[index]);
  }
  return cumulativeOdds * 100;
}

