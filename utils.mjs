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
    return hasDecimal > -1 ? String(value).slice(0,hasDecimal+2) : String(value);
}