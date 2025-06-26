/**
 * Runs a Monte Carlo simulation choosing random 'cards' from the provided site deck
 * @param {Array<string>} siteDeck
 * @param {Array<Array<string>>} successCombinations
 * @param {number} [iterations]
 * @param {number} [draws]
 * @returns {number} 
 */
export function simulateProbability(siteDeck, successCombinations, iterations = 1000, draws) {
    const criteriaLength = successCombinations[0].length;
    let successCounter = 0;
    const joinedSuccessArray = [];
    const drawCount = draws ? draws : criteriaLength;

    for (let index = 0; index < successCombinations.length; index++) {
        joinedSuccessArray.push(successCombinations[index].join(","));
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

        // Comparing strings is easier, so make a 'signature' of the symbols
        const joinedPickedArray = pickedCards.sort().join(",");
        if(joinedSuccessArray.includes(joinedPickedArray)) {
            successCounter++;
        }
    }
    return (successCounter / iterations) * 100;
}