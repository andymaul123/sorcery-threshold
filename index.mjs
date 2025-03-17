
import { parseArgs } from 'node:util';
import { getThresholdData, readAndTransformRawData, writeParsedData, getListOfSites, convertDeckListToSymbols } from "./prepRawData.mjs";
import { generateCombinations } from './generateCombinations.mjs';
import { deriveProbability } from "./deriveProbability.mjs";
import { simulateProbability } from "./simulate-probability.mjs";
import { number } from '@inquirer/prompts';
import chalk from 'chalk';

const args = process.argv;

const options = {
    'simulate': {
      type: 'boolean'
    },
    'iterations': {
      type: 'string'
    },
    'drawCount': {
      type: 'string'
    },
  };

const { values: flags } = parseArgs({ args, options, allowPositionals: true });

async function prompt() {
  console.log(`Enter the desired threshold count for each element.`);
  const symbolEarth = '\u{1F703}';
  const symbolAir = '\u{1F701}';
  const symbolFire = '\u{1F702}';
  const symbolWater = '\u{1F704}';

  let criteriaObject = {};

  criteriaObject.earth = await number({ message: chalk.green(`${symbolEarth} Earth Threshold`) });
  criteriaObject.air = await number({ message: chalk.cyan(`${symbolAir} Air Threshold`) });
  criteriaObject.fire = await number({ message: chalk.red(`${symbolFire} Fire Threshold`) });
  criteriaObject.water = await number({ message: chalk.blue(`${symbolWater} Water Threshold`) });

  let criteriaArray = [];

  for (const key in criteriaObject) {
    if (Object.prototype.hasOwnProperty.call(criteriaObject, key)) {
      for (let index = 0; index < criteriaObject[key]; index++) {
        criteriaArray.push(key.substring(0,1));
      }
    }
  }

  init(criteriaArray.sort());
}


function init(criteria) {
    // Step 1: Ensure there is threshold data to work with, otherwise create it using the provided sorcery-cards.json
    const thresholdData = getThresholdData();
    if(!thresholdData) {
        console.log(`threshold-data.json not found, creating it...`);
        const rawData = readAndTransformRawData();
        writeParsedData(rawData);
    }

    // Step 2: Get the user list of cards
    const siteDeck = getListOfSites();
    if(!siteDeck) {
        throw new console.error(`No list of sites provided. Please create a list.txt in the root directory. See README for more information.`);
        
    }
    const siteDeckSymbols = convertDeckListToSymbols(siteDeck);

    // Step 3: Feed the deck list symbols into the combinator
    if(!criteria) {
      throw new console.error(`Threshold criteria is missing; this is likely a bug`);
    }

    const possibleSuccessCombinations = generateCombinations(criteria, siteDeckSymbols);
    

    // Step 4: Feed the possible success combinations into the probability equations

    let odds;
    if(flags.simulation) {
        odds = simulateProbability(siteDeckSymbols, possibleSuccessCombinations, flags.iterations, flags.drawCount);
    }
    else {
        odds = deriveProbability(siteDeckSymbols, possibleSuccessCombinations);
    }

    console.log(`Odds of getting ${criteria} in a draw of ${criteria.length} is ${odds}`);

}

prompt();