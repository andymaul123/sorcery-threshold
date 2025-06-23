export function simulateProbability(siteDeckSymbols, successCombinations, iterations = 1000, drawCount = 4) {
    console.log(`Simulating probability...`);
    let successCounter = 0;
    let joinedSuccessArray = [];
    const isStandardDrawCount = drawCount === successCombinations[0].length;

    // Joins the contents of the success array for easier comparison later,
    // if the drawCount is the same as criteria length
    if(isStandardDrawCount) {
        for (let index = 0; index < successCombinations.length; index++) {
            joinedSuccessArray.push(successCombinations[index].join(","));
            
        }
    }
    // determines if a selected set meets the criteria
    // e.g. [a, ae, e, w] meets the criteria [a, e, e, w] despite not having identical symbols
    // prioritizes exact matches, then dual types, and so on 
    function isCriteriaMet(randomSelection) {
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

    // Run the simulation based on the iterations provided
    for (let i = 0; i < iterations; i++) {
        let copiedSiteDeckSymbolsArray = siteDeckSymbols.slice();
        let pickedCards = [];
        let randomNumber;

        for (let j = 0; j < drawCount; j++) {
            randomNumber = Math.floor(Math.random() * copiedSiteDeckSymbolsArray.length);
            pickedCards.push(copiedSiteDeckSymbolsArray[randomNumber]);
            copiedSiteDeckSymbolsArray.splice(randomNumber, 1); 
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
        else if (!isStandardDrawCount) {
            pickedCards.sort();
            if(isCriteriaMet(pickedCards)) {
                successCounter++;
            }
        }
    }
    return (successCounter / iterations) * 100;
}