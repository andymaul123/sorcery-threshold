
import { parseArgs } from 'node:util';
import { 
  getThresholdData, 
  readAndTransformRawData, 
  writeParsedData, 
  getListOfSites, 
  convertDeckListToSymbols,
  saveCriteria, 
  loadCriteria
} from "./source-data.mjs";
import { generateCombinations } from './recursive-combinator.mjs';
import { deriveProbability } from "./probability.mjs";
import { simulateProbability } from "./simulation.mjs";
import { cleanTrailingFloatingPoint } from './utils.mjs';
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
    'wild': {
      type: 'boolean'
    },
    'forceNew': {
      type: 'boolean'
    },
    'save': {
      type: 'boolean'
    },
  };

const { values: flags } = parseArgs({ args, options, allowPositionals: true });

async function prompt() {
  let criteriaArray = [];
  const loadedCriteria = loadCriteria();
  if(loadedCriteria) {
    console.log(`Saved criteria found`);
    criteriaArray = JSON.parse(loadedCriteria);
  }
  else {
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
  
    for (const key in criteriaObject) {
      if (Object.prototype.hasOwnProperty.call(criteriaObject, key)) {
        for (let index = 0; index < criteriaObject[key]; index++) {
          criteriaArray.push(key.substring(0,1));
        }
      }
    }
    
    if(flags.save) {
      saveCriteria(criteriaArray.sort());
    }
  }

  init(criteriaArray.sort());
}


async function init(criteria) {
    // Step 1: Ensure there is threshold data to work with, otherwise create it using the provided sorcery-cards.json
    const thresholdData = getThresholdData();
    if(flags.forceNew || !thresholdData) {
        const forceMessage = `Re-creating threshold-data.json`;
        const newMessage = `Creating threshold-data.json`;
        console.log(flags.forceNew ? forceMessage : newMessage);
        const rawData = readAndTransformRawData(flags.wild, flags.forceNew);
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

    const drawCount = flags.drawCount ? flags.drawCount : 3;

    const possibleSuccessCombinations = await generateCombinations(siteDeckSymbols, criteria, drawCount);

    // Step 4: Feed the possible success combinations into the probability equations
    let chance;
    if(flags.simulate) {
        console.log(`Simulating probability...`);
        chance = simulateProbability(siteDeckSymbols, criteria, drawCount, flags.iterations);
    }
    else {
        console.log(`Calculating probability...`);
        chance = deriveProbability(siteDeckSymbols, possibleSuccessCombinations);
    }
    
    console.log(`Probability of getting ${criteria} in a draw of ${drawCount} is ${cleanTrailingFloatingPoint(chance)}%`);
}

prompt();