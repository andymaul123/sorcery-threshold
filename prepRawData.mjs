import { readFileSync, writeFileSync } from 'node:fs';

export function readAndTransformRawData() {
  const cards = readFileSync('./sorcery-cards.json', 'utf8', (err, cards) => {
    if (err) throw err;
  });

  let symbolMap = {};
  const cardData = JSON.parse(cards);

  for (let index = 0; index < cardData.length; index++) {
    if(cardData[index].guardian.type == "Site"){
      const cardName = normalizeName(cardData[index].name);
      let symbolString = "";
      for (const key in cardData[index].guardian.thresholds) {
          if (Object.prototype.hasOwnProperty.call(cardData[index].guardian.thresholds, key)) {
              if(cardData[index].guardian.thresholds[key] > 0) {
                  for (let j = 0; j < Number(cardData[index].guardian.thresholds[key]); j++) {
                      symbolString += key.toString().substring(0,1);
                  }
              }
              
          }
      }
      symbolMap[cardName] = symbolString;
    }

  }
  return symbolMap;
}

export function writeParsedData(data) {
  console.log(data);
  writeFileSync('threshold-data.json', JSON.stringify(data), 'utf8', () => {
    console.log(`Writing contents to ./threshold-data.json`);
  });
}

export function getThresholdData() {
  try {
      return readFileSync('./threshold-data.json', 'utf8', (err, data) => {
          return data;
        });
  } catch (error) {
      return undefined;
  }
}

export function getListOfSites() {
  try {
      return readFileSync('./list.txt', 'utf8', (err, data) => {
          return data;
        });
  } catch (error) {
      return undefined;
  }
}


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

function normalizeName(name) {
  return name.toLowerCase().replace(/ /g,"_");
}


