import { binomialCoefficient, createInitialPointerArray } from "./utils.mjs";

/**
 * Validates a possible combination by looping through each element in the criteria and 
 * doing a string search for that character. If found, the character is removed and the loop continues.
 * If one is not found, it early returns.
 * @param {Array<string>} possibleCombination
 * @param {Array<string>} criteria
 * @returns {boolean} 
 */
function combinationValidator(possibleCombination, criteria) {
    let mutablePossibleCombinationSignature = possibleCombination.join('');
    for (let index = 0; index < criteria.length; index++) {
        if(mutablePossibleCombinationSignature.indexOf(criteria[index]) > -1) {
            let mutatedString = mutablePossibleCombinationSignature.substring(0, index - 1) + mutablePossibleCombinationSignature.substring(index, mutablePossibleCombinationSignature.length);
            mutablePossibleCombinationSignature = mutatedString;
        } 
        else {
            return false;
        }
    }
    return true;
}

/**
 * This does the heavy lifting. It is a recursive, brute-force function that walks through every combination from the given parameters.
 * @param {number} drawCount
 * @param {Array<string>} siteDeck
 * @param {Array<string>} criteria
 * @param {Array<number>} pointerArray
 * @param {number} currentPointerArrayPosition
 * @param {Array<Array<string>>} accumulatedCombinations
 * @param {number} totalCombinations
 * @param {number} iterations
 * @param {boolean} skipFiltering
 * @returns {Array<Array<string>>} 
 */
function recursiveCombinator(drawCount, siteDeck, criteria, pointerArray, currentPointerArrayPosition, accumulatedCombinations, totalCombinations, iterations, skipFiltering) {

    // The number of combinations from 30 cards with 7 samples. Used as the upper bound to prevent infinite loops.
    const maxSafety = 2035800;
    const safetyNumber = maxSafety < totalCombinations ? maxSafety + 1 : totalCombinations + 1;

    if(iterations >= safetyNumber) {
        console.log(`Safety limit reached, early returning`);
        return accumulatedCombinations;
    }

    const possibleCombination = [];
    // Create a possible combination from the site deck using the pointerArray indexes to select N cards
    for (let index = 0; index < pointerArray.length; index++) {
        possibleCombination.push(siteDeck[pointerArray[index]]);
    }

    if(skipFiltering) {
        accumulatedCombinations.push(possibleCombination);
    }
    else if(combinationValidator(possibleCombination, criteria)) {
        accumulatedCombinations.push(possibleCombination);
    }



    // Reset the positions
    if(pointerArray[currentPointerArrayPosition] >= (siteDeck.length - 1) - (Math.abs(currentPointerArrayPosition - (pointerArray.length - 1)))) {
        pointerArray[currentPointerArrayPosition - 1] = pointerArray[currentPointerArrayPosition - 1] + 1;

        for (let index = currentPointerArrayPosition; index < pointerArray.length; index++) {
            pointerArray[index] = pointerArray[index-1] + 1;
        }
        if(currentPointerArrayPosition > 1) {
            currentPointerArrayPosition--;
        }
    }
    else {
        pointerArray[currentPointerArrayPosition] = pointerArray[currentPointerArrayPosition] + 1;
    }

    if(iterations == totalCombinations) {
        console.log(accumulatedCombinations);
        return accumulatedCombinations;
    }
    else {
        iterations++;
        recursiveCombinator(drawCount, siteDeck, criteria, pointerArray, currentPointerArrayPosition, accumulatedCombinations, totalCombinations, iterations)
    }
}

/**
 * Returns an array of combinations that satisfy a given criteria and sample size.
 * For example, it answers the question "How many 2-card combinations would give me two air threshold in my 30 card site deck?"
 * @param {Array<string>} siteDeck
 * @param {Array<string>} criteria
 * @param {number} drawCount
 * @param {boolean} skipFiltering
 * @returns {Array<Array<string>>} 
 */
export function generateCombinations(siteDeck, criteria, drawCount, skipFiltering) {
    const pointerArray = createInitialPointerArray(drawCount);
    const totalCombinations = binomialCoefficient(siteDeck.length, drawCount);
    return recursiveCombinator(drawCount, siteDeck, criteria, pointerArray, drawCount-1, [], totalCombinations, 1, skipFiltering);
}