import { combinationValidator } from "./utils.mjs";
/**
 * Runs a Monte Carlo simulation choosing random 'cards' from the provided site deck
 * @param {Array<string>} siteDeck
 * @param {Array<string>} criteria
 * @param {number} [iterations]
 * @param {number} [drawCount]
 * @returns {number} 
 */
export function simulateProbability(siteDeck, criteria, iterations = 1000, drawCount) {

    let successCounter = 0;

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