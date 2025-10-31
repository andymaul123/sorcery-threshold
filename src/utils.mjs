/**
 * Calculates binomial coefficient; how many ways to choose k items from n items without repetition or order
 * Taken from https://www.30secondsofcode.org/js/s/binomial-coefficient/
 * @param {number} n
 * @param {number} k
 * @returns {number} 
 */
export function binomialCoefficient (n, k) {
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
 * Creates a sequential array of numbers like [0,1,2] based on a number (3)
 * @param {number} drawCount
 * @returns {Array<number>} 
 */
export function createInitialPointerArray(drawCount) {
    const pointerArray=[];
    if(drawCount && drawCount > 0) {
        for (let index = 0; index < drawCount; index++) {
            pointerArray.push(index);
        }
    }
    return pointerArray;
}

/**
 * Creates a frequency map of symbols given a string array of values
 * @param {Array<String>} inputArray
 * @returns {Object}
 */
export function createFrequencyMap(inputArray) {
    const criteriaFrequencyMap = {};
    for (let index = 0; index < inputArray.length; index++) {
        if(!criteriaFrequencyMap.hasOwnProperty(inputArray[index])){
            criteriaFrequencyMap[inputArray[index]] = inputArray.filter((letter) => letter == inputArray[index]).length;
        }
    }
    return criteriaFrequencyMap;
}

/**
 * Clips a long decimal number to something more readable. Doesn't round the fractional value because I don't care.
 * @param {number | string} value
 * @returns {string}
 */
export function cleanTrailingFloatingPoint(value) {
    const hasDecimal = String(value).indexOf('.');
    return hasDecimal > -1 ? String(value).slice(0,hasDecimal+2) : String(value + ".0");
}

/**
 * Given a string and an indexed position, extract the position and return the other two halves glued back together
 * @param {string} str
 * @param {number} index
 * @returns {string}
 */
export function extractStringSection(str, index) {
    return str.substring(0, index) + str.substring(index+1);
}