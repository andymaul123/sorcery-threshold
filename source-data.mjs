import { readFileSync, writeFileSync } from 'node:fs';
import { wildCards } from './wild-cards.mjs';

/**
 * Attempts to read card data from disk and transforms it into threshold data
 * @param {boolean} useWildCards
 * @returns {Object.<string, string>} 
 */
export function readAndTransformRawData(useWildCards) {
  const cards = readFileSync('./sorcery-cards.json', 'utf8', (err, cards) => {
    if (err) throw err;
  });

  let symbolMap = {};
  const cardData = JSON.parse(cards);

  for (let index = 0; index < cardData.length; index++) {
    if(cardData[index].guardian.type == "Site"){
      const cardName = normalizeName(cardData[index].name);
      let symbolString = "";
      if(useWildCards && wildCards.includes(cardName)) {
        symbolString = "aefw";
      }
      else {
        for (const key in cardData[index].guardian.thresholds) {
          if (Object.prototype.hasOwnProperty.call(cardData[index].guardian.thresholds, key)) {
              if(cardData[index].guardian.thresholds[key] > 0) {
                  for (let j = 0; j < Number(cardData[index].guardian.thresholds[key]); j++) {
                      symbolString += key.toString().substring(0,1);
                  }
              }
              
          }
        }
      }
      symbolMap[cardName] = symbolString;
    }

  }
  return symbolMap;
}

/**
 * Writes threshold data to disk
 * @param {Object.<string, string>} data
 * @returns {void} 
 */
export function writeParsedData(data) {
  writeFileSync('threshold-data.json', JSON.stringify(data), 'utf8', () => {
    console.log(`Writing contents to ./threshold-data.json`);
  });
}

/**
 * Reads threshold data from disk
 * @returns {Object.<string, string> | undefined} 
 */
export function getThresholdData() {
  try {
      return readFileSync('./threshold-data.json', 'utf8', (err, data) => {
          return data;
        });
  } catch (error) {
      return undefined;
  }
}

/**
 * Reads user-supplied txt file of sites from disk and returns it
 */
export function getListOfSites() {
  try {
      return readFileSync('./list.txt', 'utf8', (err, data) => {
          return data;
        });
  } catch (error) {
      return undefined;
  }
}

/**
 * Converts the list of sites into an array of threshold symbols the sites provide
 * @param {string} input
 * @returns {Array<string>} 
 */
export function convertDeckListToSymbols(input) {
  const thresholdData = JSON.parse(getThresholdData());
  const tempArray = input.split(/\n|\r/g);
  let symbolsArray = [];

  for (let index = 0; index < tempArray.length; index++) {
    const count = tempArray[index].substring(0,1);
    const name = normalizeName(tempArray[index].substring(3));
    if(!isNaN(count)) {
      for (let index = 0; index < count; index++) {
        // For sites that don't produce threshold, mark with an 'x' instead of omitting
        // This preserves overall count, e.g. 30, of the decklist for reasons later
        if(thresholdData[name] == "") {
          symbolsArray.push("x");
        } else {
          symbolsArray.push(thresholdData[name]);
        }
      }
    }
  }
  symbolsArray = symbolsArray.filter(function(item){
    return item != "";
});
  return symbolsArray.sort();
}
/**
 * Takes a string, lowercases it, and normalizes spaces into underscores so names can be used as object keys
 * @param {string} name
 * @returns {string} 
 */
function normalizeName(name) {
  return name.toLowerCase().replace(/ /g,"_");
}

/**
 * Saves criteria data to disk
 * @param {Array<string>} criteria
 * @returns {void} 
 */
export function saveCriteria(criteria) {
  console.log(`Saving threshold criteria to ./criteria.json. Delete when done.`);
  writeFileSync('criteria.json', JSON.stringify(criteria), 'utf8', () => {});
}

/**
 * Reads criteria data from disk
 * @returns {Array<string> | undefined}
 */
export function loadCriteria() {
  try {
      return readFileSync('./criteria.json', 'utf8', (err, data) => {return data;});
  } catch (error) {
      return undefined;
  }
}


