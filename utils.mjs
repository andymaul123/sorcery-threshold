/**
 * Creates a frequency map of symbols given a string array of values
 * @param {Array<String>} inputArray
 * @returns {Object}} 
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