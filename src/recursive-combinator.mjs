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
    // Flag added for ease of testing
    if(skipFiltering) {
        accumulatedCombinations.push(possibleCombination);
    }
    else if(combinationValidator(possibleCombination, criteria)) {
        accumulatedCombinations.push(possibleCombination);
    }
    /**
     * Reset the pointer positions. This is the key to how the structure is walked.
     * Example
     * Site Deck: [a,ae,f,aefw]
     * Criteria: aefw (one of each element) in a draw of 3
     * The drawCount three will create a 'pointer array' like so: [0,1,2]
     * This pointer array represents three indices from the site deck; three cards chosen to be examined as a possible combination.
     * In this example, the starting pointer array [0,1,2] would indicate cards a,ae,f.
     * The goal is to look at a possible combination, evaluate it, and then update the pointer array and pass all of the data back
     * into the recursive function.
     * 
     * If you were to write out the site deck elements in a vertical list and manually step through all of the combinations you may arrive at
     * the following:
     * [0,1,2] -> a,ae,f        
     * [0,1,3] -> a,ae,aefw
     * [0,2,3] -> a,f,aefw
     * [1,2,3] -> ae,f,aefw
     * 
     * currentPointerArrayPosition refers to which index is currently being evaluated
     * 
     * The first if statement checks if the current position is at its end. In our example, the last card in the deck is index 3.
     * If it exceeds the limit, the pointer array is 'reset'. It moves from right to left.
     * Example: when the iteration is [0,1,3] we know it cannot go to [0,1,4] because there is no card at position 4. 
     * The pointer position is moved, and it and all positions to the right of it are incremented/reset. 
     * Thus, the next pointer array would be [0,2,3].
     * 
     * If the pointer array doesn't need to be reset, increment the current position by 1.
     * 
     * Iterations are tracked and compared to the total combinations possible, ending the recursion.
     */
    if(pointerArray.length >= 2 && pointerArray[currentPointerArrayPosition] >= (siteDeck.length - 1) - (Math.abs(currentPointerArrayPosition - (pointerArray.length - 1)))) {
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
        return accumulatedCombinations;
    }
    else {
        iterations++;
        return recursiveCombinator(drawCount, siteDeck, criteria, pointerArray, currentPointerArrayPosition, accumulatedCombinations, totalCombinations, iterations, skipFiltering)
    }
}

/**
 * Returns an array of combinations that satisfy a given criteria and sample size.
 * For example, it answers the question "How many 2-card combinations would give me two air threshold in my 30 card site deck?"
 * @param {Array<string>} siteDeck
 * @param {Array<string>} criteria
 * @param {number} drawCount
 * @param {boolean} [skipFiltering]
 * @returns {Array<Array<string>>} 
 */
export function generateCombinations(siteDeck, criteria, drawCount, skipFiltering=false) {
    const pointerArray = createInitialPointerArray(drawCount);
    const totalCombinations = binomialCoefficient(siteDeck.length, drawCount);
    return recursiveCombinator(drawCount, siteDeck, criteria, pointerArray, drawCount-1, [], totalCombinations, 1, skipFiltering);
}