/**
 * Generates all possible combinations that would satisfy a given criteria
 * @param {Array<String>} criteria
 * @param {Array<String>} siteDeckSymbols
 * @returns {Array<String>} 
 */

export function generateCombinations(criteria, siteDeckSymbols) {

    const criteriaFrequencyMap = createFrequencyMap(criteria);
    const reducedSiteDeckSymbols = reduceSiteDeckSymbols(criteria, criteriaFrequencyMap, siteDeckSymbols);
    const decklistFrequencyMap = createFrequencyMap(reducedSiteDeckSymbols);
    
    let matchCount = 0;
    const combinationsArray = [];
    const combinationSignatureArray = [];
    const safetyValue = 300;

    // Seed the first combinations array with the criteria
    combinationsArray.push(criteria);
    // TODO: It is technically possible that the deck list does not actually contain the exact criteria match. 
    // This will throw off the actual odds if it's true. This scenario could be accounted for by looping through and checking for 
    // the exact match and noting true/false, but I'm lazy and this is "close enough" for now

    // Since equality is difficult to determine between arrays, a second array storing the string "signature" is used
    combinationSignatureArray.push(criteria.join(","));

    // This is the meat and potatoes. It is a brute force loop that will go through every combination and log if there's a match
    // New matches are added to the array mid-loop, so it will feed itself until its exhausted every combination or it hits the safetyValve number

    let iterations = 0;
    // For each item in the combinationsArray, e.g. [ [a,e,e,w], [...], ... ]
    for (let combinationsArrayIndex = 0; combinationsArrayIndex < combinationsArray.length; combinationsArrayIndex++) {
        iterations++;
        if(iterations >= safetyValue) {
            console.log(`Possible combinations has exceeded the safety value, which prevents infinite looping. Please increase the safety value and run again.`);
            return;
        }
        // For each value in a given combinationsArray item array, e.g. [a,e,e,w]
        for (let selectedCombinationIndex = 0; selectedCombinationIndex < combinationsArray[combinationsArrayIndex].length; selectedCombinationIndex++) {
            // we're now nested down to the individual letter, e.g. "a" or "e"
            // For each item in reducedSiteDeckSymbols array, e.g. 'a' or 'aef'
            // Comparing individual symbols from the current combinations array against the symbol in the criteria, 'a' <-> 'aef'
            for (let index = 0; index < reducedSiteDeckSymbols.length; index++) {
                if(reducedSiteDeckSymbols[index] == combinationsArray[combinationsArrayIndex][selectedCombinationIndex]) {
                    // If there is a direct match, do nothing
                    // TODO: why am I doing nothing here?
                }
                
                else if(reducedSiteDeckSymbols[index].includes(combinationsArray[combinationsArrayIndex][selectedCombinationIndex])) {
                    // create a new copy of the combination set
                    let newMatchedSet = combinationsArray[combinationsArrayIndex].slice(0);
                    // replace the value with the matched value only if there are fewer symbols of that type than the limit defined above
                    if(newMatchedSet.filter((letter) => letter == reducedSiteDeckSymbols[index]).length < decklistFrequencyMap[reducedSiteDeckSymbols[index]]) {
                        // Replace the item
                        newMatchedSet[selectedCombinationIndex] = reducedSiteDeckSymbols[index];
                        newMatchedSet.sort();
                        // Check if the new set is unique
                        if(!combinationSignatureArray.includes(newMatchedSet.join(","))) {
                            combinationSignatureArray.push(newMatchedSet.join(","));
                            combinationsArray.push(newMatchedSet);
                            matchCount++;
                        }
                    }
                }
            }
        }
    }

    return combinationsArray;
}

/**
 * Creates a frequency map of symbols given a string array of values
 * @param {Array<String>} inputArray
 * @returns {Object}} 
 */
function createFrequencyMap(inputArray) {
    const criteriaFrequencyMap = {};
    for (let index = 0; index < inputArray.length; index++) {
        if(!criteriaFrequencyMap.hasOwnProperty(inputArray[index]))
        criteriaFrequencyMap[inputArray[index]] = inputArray.filter((letter) => letter == inputArray[index]).length
    }
    return criteriaFrequencyMap;
}



/**
 * Reduces siteDeckSymbols' frequencies down to the maximum supported by the criteria
 * @param {Array<String>} criteria
 * @param {Array<String>} siteDeckSymbols
 * @returns {Array<String>} 
 */
function reduceSiteDeckSymbols(criteria, criteriaFrequencyMap, siteDeckSymbols) {
    // For each symbol type (a,e,f,w) reduce the frequency of that symbol down to the maximum number of symbols it matches with in the criteria array
    // Example 1: 'a' array = [a,a,a,a,a] but criteria is [a,e,e,w]. Reduce the 'a' array down to [a], as there is only one possible match against the criteria
    // Example 2: 'ae' array = [ae, ae, ae, ae]. Reduce down to [ae, ae, ae]
    // TODO: Why am I doing this again?
    const reducedSiteDeckSymbols = [];
    for (let index = 0; index < siteDeckSymbols.length; index++) {
        // exact matches, e.g. basic sites with one threshold
        if(criteriaFrequencyMap.hasOwnProperty(siteDeckSymbols[index])) {
            if(reducedSiteDeckSymbols.filter((letter) => siteDeckSymbols[index] == letter).length < criteriaFrequencyMap[siteDeckSymbols[index]]) {
                reducedSiteDeckSymbols.push(siteDeckSymbols[index]);
            }
        } 
        // multi-colored sites and others
        else {
            let includeCount = 0;
            for (let j = 0; j < criteria.length; j++) {
                if(siteDeckSymbols[index].includes(criteria[j])) {
                    includeCount++;
                }
            }
            if(includeCount > 0 && reducedSiteDeckSymbols.filter((letter) => letter == siteDeckSymbols[index]).length < includeCount) {
                reducedSiteDeckSymbols.push(siteDeckSymbols[index]);
            }
        }
    }
    reducedSiteDeckSymbols.sort();
    return reducedSiteDeckSymbols;
}

