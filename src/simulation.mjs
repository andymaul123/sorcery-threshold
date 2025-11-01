import { combinationValidator } from "./utils.mjs";
/**
 * Runs a Monte Carlo simulation choosing random 'cards' from the provided site deck
 * @param {Array<string>} siteDeck
 * @param {Array<string>} criteria
 * @param {number} drawCount
 * @param {number} [iterations]
 * @returns {number} 
 */
export function simulateProbability(siteDeck, criteria, drawCount, iterations = 10000,) {
    console.log(`Running ${iterations} simulations...`);
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

       let pickedCardsSignature = pickedCards.join(',');
        if(combinationValidator(pickedCardsSignature, criteria)) {
            successCounter++;
        }
    }
    return (successCounter / iterations) * 100;
}