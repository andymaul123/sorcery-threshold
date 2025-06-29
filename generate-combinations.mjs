import { createFrequencyMap } from "./utils.mjs";

/**
 * A truncated explanation of the strategy behind generateCombinations.
 * 
 * Given criteria [a,e], a site deck of [a,af,e,w] contains two possible combinations that include the criteria.
 * 
 * Next a combinationsArray is created, and seeded with the criteria as its first item.
 * combinationsArray = [[a,e]]
 * 
 * The script will loop over every item in the combinationsArray (1 item to start), but also pushes new combinations it finds into the combinationsArray
 * as the loop progresses.
 * 
 * Starting at the first item, [a,e], another loop is performed over each symbol. The first symbol is 'a'.
 * 
 * A *third* loop occurs, but this time over every item in the site deck. The symbol being looped over ('a') is compared with the current symbol in
 * the site deck.
 * If the symbol in the site deck would make a 'valid combination', the symbol is replaced with the one from the site deck and that new combination is pushed to the 
 * combinationsArray.
 * 
 * 'a' is being replaced, check 'a'. Skip, as it's the exact symbol we're checking for.
 * 'a' is being replaced, check 'af'. Match. Combination [af,e] will be pushed to combinationsArray if not already in there.
 * 'a' is being replaced, check 'e'. [e,e] is not a match.
 * 'a' is being replaced, check 'w'. [w,e] is not a match.
 * 
 * Now do the next symbol in [a,e]:
 * 'e' is being replaced, check 'a'. [a,a] is not a match.
 * 'e' is being replaced, check 'af'. [a,af] is not a match.
 * 'e' is being replaced, check 'e'. Skip, as it's the exact symbol we're checking for.
 * 'e' is being replaced, check 'w'. [a,w] is not a match.
 * 
 * Finished with [a,e], move onto the next item in the combinationsArray, which is [af,e]. No new combinations are found, thus the final combinationsArray
 * is [[a,e],[af,e]].
 * 
 * This strategy works nicely when you are trying to find possible combinations in the same number of draws as the criteria length, i.e.
 * "find [a,e] in two draws." When additional draws are added, things get more complicated.
 * 
 * When there is a 'drawCount', the criteria array is filled up with wildcard (*) characters to match the drawCount length. Using the 
 * above example, criteria [a,e] with drawCount 3 creates a new criteria of [a,e,*].
 * 
 * The same overall approach is taken, except wild cards get replaced with any symbol, and additional logic is needed in areas to account for them.
 */


/**
 * Given an array of values and a criteria, generates all possible combinations from the array that satisfy the criteria
 * @param {Array<string>} initialCriteria
 * @param {Array<string>} siteDeckSymbols
 * @param {number} drawCount
 * @returns {Array<Array<string>>} 
 */

export function generateCombinations(initialCriteria, siteDeckSymbols, drawCount = 0) {
    const criteria = [...initialCriteria];
    const hasDrawCount = criteria.length < drawCount;
    const MATCH_ANY = '*';
    // If the criteria array length is less than the drawCount, fill the criteria array with MATCH_ANY symbols until the length is equal
    if(hasDrawCount) {
        const extraCriteria = drawCount - criteria.length;
        for (let index = 0; index < extraCriteria; index++) {
            criteria.push(MATCH_ANY);
        }
    }
    const decklistFrequencyMap = createFrequencyMap(siteDeckSymbols);
    
    let matchCount = 0;
    const combinationsArray = [];
    const combinationSignatureArray = [];
    const safetyValue = 2200;

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
            // For each item in siteDeckSymbols array, e.g. 'a' or 'aef

                for (let index = 0; index < siteDeckSymbols.length; index++) {
                    // If there is a direct match, do nothing; we already have this combination set
                    if(siteDeckSymbols[index] == combinationsArray[combinationsArrayIndex][selectedCombinationIndex]) {}
                    // If the symbol being compared is a wild card symbol
                    else if(combinationsArray[combinationsArrayIndex][selectedCombinationIndex] == MATCH_ANY) {
                        let newMatchedSet = combinationsArray[combinationsArrayIndex].slice(0);
                        // Replace the symbol *before* we do checks, because it's a wildcard
                        newMatchedSet[selectedCombinationIndex] = siteDeckSymbols[index];
                        if(checkSymbolAmounts(newMatchedSet, siteDeckSymbols[index], decklistFrequencyMap[siteDeckSymbols[index]], false)) {
                            newMatchedSet.sort();
                            // Check if the new set is unique
                            if(!combinationSignatureArray.includes(newMatchedSet.join(","))) {
                                combinationSignatureArray.push(newMatchedSet.join(","));
                                combinationsArray.push(newMatchedSet);
                                matchCount++;
                            }
                        }
                    }
                    // If the original decklist symbol includes the compared symbol, then...
                    else if(siteDeckSymbols[index].includes(combinationsArray[combinationsArrayIndex][selectedCombinationIndex])) {
                        // create a new copy of the combination set
                        let newMatchedSet = combinationsArray[combinationsArrayIndex].slice(0);
                        // replace the value with the matched value only if there are fewer symbols of that type than the limit defined above
                        if(checkSymbolAmounts(newMatchedSet, siteDeckSymbols[index], decklistFrequencyMap[siteDeckSymbols[index]], true) && !newMatchedSet.includes(MATCH_ANY)) {
                            // Replace the item
                            newMatchedSet[selectedCombinationIndex] = siteDeckSymbols[index];
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
    // Remove the first entry seeded into the array that contains wildcard symbols
    if(hasDrawCount) {
        return combinationsArray.slice(1);
    }
    return combinationsArray;
}


/**
 * Checks a possible match set's symbols to ensure they are below the ceiling defined in the decklistFrequecyMap
 * @param {Array<string>} possibleMatchSet
 * @param {string} currentSymbolToCheckAgainst
 * @param {number} symbolFrequencyLimit
 * @param {boolean} checkLessOnly
 * @returns {boolean} 
 */
function checkSymbolAmounts(possibleMatchSet, currentSymbolToCheckAgainst, symbolFrequencyLimit, checkLessOnly) {
    const filteredSet = possibleMatchSet.filter((symbol) => {
        return symbol == currentSymbolToCheckAgainst
    });
    if(checkLessOnly && filteredSet.length < symbolFrequencyLimit) {
        return true;
    }
    else if(!checkLessOnly && filteredSet.length <= symbolFrequencyLimit) {
        return true;
    }
    return false;
}

