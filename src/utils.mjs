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
    for (let index = 0; index < drawCount; index++) {
        pointerArray.push(index);
    }
    return pointerArray;
}