/**
 * Runs a Monte Carlo simulation choosing random 'cards' from the provided site deck
 * @param {Array<String>} siteDeck
 * @param {Array<Array<String>>} successCombinations
 * @param {number} [iterations]
 * @param {number} [drawCount]
 * @returns {number} 
 */
export function simulateProbability(siteDeck, successCombinations, iterations = 1000, drawCount = 4) {
    let successCounter = 0;
    const joinedSuccessArray = [];
    const isStandardDrawCount = drawCount === successCombinations[0].length;

    // If the drawCount == criteria length, join items in the successcombinations array for easier comparison later
    if(isStandardDrawCount) {
        for (let index = 0; index < successCombinations.length; index++) {
            joinedSuccessArray.push(successCombinations[index].join(","));
        }
    }

    // Run the simulation based on the iterations provided
    for (let i = 0; i < iterations; i++) {
        const proxiedSiteDeck = siteDeck.slice();
        const pickedCards = [];
        let randomNumber;

        // Pick n cards at random from the copied siteDeck
        for (let j = 0; j < drawCount; j++) {
            randomNumber = Math.floor(Math.random() * proxiedSiteDeck.length);
            pickedCards.push(proxiedSiteDeck[randomNumber]);
            proxiedSiteDeck.splice(randomNumber, 1); 
        }

        // If the drawCount is the same size as the criteria array
        // i.e. "odds of getting a,e,e,w on turn 4"
        // matching is easier. We use string comparisons instead of equality checks on arrays
        if(isStandardDrawCount) {
            const joinedPickedArray = pickedCards.sort().join(",");
            if(joinedSuccessArray.includes(joinedPickedArray)) {
                successCounter++;
            }
        } 
        // Otherwise, use the isCriteriaMet function
        // i.e. odds of getting criteria (4 symbols) in 7 draws
        else {
            pickedCards.sort();
            if(isCriteriaMet(pickedCards, successCombinations)) {
                successCounter++;
            }
        }
    }
    return (successCounter / iterations) * 100;
}

/**
 * Determines if a chosen set satisfies criteria of any items the successCombinations array.
 * Example [a, ae, e, w] meets the criteria [a, e, e, w] despite not having identical symbols.
 * Prioritizes exact matches, then dual types, and so on
 * @param {Array<String>} randomSelection
 * @param {Array<Array<String>>} successCombinations
 * @returns {boolean} 
 */
function isCriteriaMet(randomSelection, successCombinations) {
    let base = [];
    let dual = [];
    let triple = [];
    let quad = [];

    // sort all symbols in the set into sub arrays based on length
    for (let index = 0; index < randomSelection.length; index++) {
        switch(randomSelection[index].length) {
            case 1:
                base.push(randomSelection[index]);
                break;
            case 2: 
                dual.push(randomSelection[index]);
                break;
            case 3:
                triple.push(randomSelection[index]);
                break;
            case 4: 
                quad.push(randomSelection[index]);
                break;
            default:
                console.log(`Error: somehow exceeded length of four characters`);
        } 
    }

    // Iterate over every set in the success combinations array
    // then iterate over each symbol in that set
    // check for a match in length-priority, mutating arrays as we go to prevent 
    // multi-matching. Return true if the criteria is met by the set
    for (let i = 0; i < successCombinations.length; i++) {
        let matchCount = 0;
        for (let j = 0; j < successCombinations[i].length; j++) {
            const baseMatchIndex = base.findIndex((value, index, array) => {
                return value.includes(successCombinations[i][j]);
            });
            const dualMatchIndex = dual.findIndex((value, index, array) => {
                return value.includes(successCombinations[i][j]);
            });
            const tripleMatchIndex = triple.findIndex((value, index, array) => {
                return value.includes(successCombinations[i][j]);
            });
            const quadMatchIndex = quad.findIndex((value, index, array) => {
                return value.includes(successCombinations[i][j]);
            });

            if(baseMatchIndex > -1) {
                base.splice(baseMatchIndex, 1);
                matchCount++
            }
            else if(dualMatchIndex > -1) {
                dual.splice(dualMatchIndex, 1);
                matchCount++
            }
            else if(tripleMatchIndex > -1) {
                triple.splice(tripleMatchIndex, 1);
                matchCount++
            }
            else if(quadMatchIndex > -1) {
                quad.splice(quadMatchIndex, 1);
                matchCount++
            }
        
        }
        if(matchCount == 4) {
            return true;
        }
    }
    // Otherwise return false
    return false;
}