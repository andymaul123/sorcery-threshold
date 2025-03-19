export function generateCombinations(criteria, cardArray) {

    // expandedCriteria is an object that lists the counts of each unique symbol in the *criteria array*, e.g. {a:1, e:2, w:1}
    let expandedCriteria = {};
    for (let index = 0; index < criteria.length; index++) {
        if(!expandedCriteria.hasOwnProperty(criteria[index]))
        expandedCriteria[criteria[index]] = criteria.filter((letter) => letter == criteria[index]).length
    }

    // Reduce the available options to the maximum possible, e.g. there will only ever be one 'a' symbol used in a set, but two 'e' symbols
    // This will be used later to help prevent sets with illegal combinations like [aew, aew, aew, aew]
    let reducedCardArray = [];
    for (let index = 0; index < cardArray.length; index++) {
        // exact matches, e.g. basic sites with one threshold
        if(expandedCriteria.hasOwnProperty(cardArray[index])) {
            if(reducedCardArray.filter((letter) => cardArray[index] == letter).length < expandedCriteria[cardArray[index]]) {
                reducedCardArray.push(cardArray[index]);
            }
        } 
        // multi-colored sites and others
        else {
            let includeCount = 0;
            for (let j = 0; j < criteria.length; j++) {
                if(cardArray[index].includes(criteria[j])) {
                    includeCount++;
                }
            }
            if(includeCount > 0 && reducedCardArray.filter((letter) => letter == cardArray[index]).length < includeCount) {
                reducedCardArray.push(cardArray[index]);
            }
        }
    }
    reducedCardArray.sort();

    // Same as above, we make an "expanded" object with counts for each unique symbol in the *deck list*, e.g. {a:6, e:9, w:4, ...}
    let expandedSymbolCountObject = {};
    for (let index = 0; index < reducedCardArray.length; index++) {
        if(!expandedSymbolCountObject.hasOwnProperty(reducedCardArray[index]))
        expandedSymbolCountObject[reducedCardArray[index]] = reducedCardArray.filter((letter) => letter == reducedCardArray[index]).length
    }
    
    let matchCount = 0;
    let combinationsArray = [];
    let combinationSignatureArray = [];

    // Seed the first combinations array with the criteria
    combinationsArray.push(criteria);
    // TODO: It is technically possible that the deck list does not actually contain the exact criteria match. 
    // This will throw off the actual odds if it's true. This scenario could be accounted for by looping through and checking for 
    // the exact match and noting true/false, but I'm lazy and this is "close enough" for now

    // Since equality is difficult to determine between arrays, a second array storing the string "signature" is used
    combinationSignatureArray.push(criteria.join(","));

    // This is the meat and potatoes. It is a brute force loop that will go through every combination and log if there's a match
    // New matches are added to the array mid-loop, so it will feed itself until its exhausted every combination
    const safetyValue = 300;
    let iterations = 0;
    for (let combinationsArrayIndex = 0; combinationsArrayIndex < combinationsArray.length; combinationsArrayIndex++) {
        iterations++;
        if(iterations >= safetyValue) {
            console.log(`Possible combinations has exceeded the safety value, which prevents infinite looping. Please increase the safety value and run again.`);
            return;
        }
        for (let selectedCombinationIndex = 0; selectedCombinationIndex < combinationsArray[combinationsArrayIndex].length; selectedCombinationIndex++) {
            // we're now nested down to the individual letter, e.g. "a" or "e"
            for (let index = 0; index < reducedCardArray.length; index++) {
                if(reducedCardArray[index] == combinationsArray[combinationsArrayIndex][selectedCombinationIndex]) {
                    // do nothing
                }
                else if(reducedCardArray[index].includes(combinationsArray[combinationsArrayIndex][selectedCombinationIndex])) {
                    // create a new copy of the combination set
                    let newMatchedSet = combinationsArray[combinationsArrayIndex].slice(0);
                    // replace the value with the matched value only if there are fewer symbols of that type than the limit defined above
                    if(newMatchedSet.filter((letter) => letter == reducedCardArray[index]).length < expandedSymbolCountObject[reducedCardArray[index]]) {
                        // Replace the item
                        newMatchedSet[selectedCombinationIndex] = reducedCardArray[index];
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

