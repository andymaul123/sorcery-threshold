// This will be the new 2.0 entry file

//import { generateCombinations } from "../generate-combinations.mjs";
import { generateCombinations } from "./recursive-combinator.mjs";
import { combinationValidator } from "./recursive-combinator.mjs";

const battlemageSiteDeck = [
  'a',   'a',  'a',  'a',  'a',
  'a',   'ae', 'ae', 'ae', 'aef',
  'aew', 'e',  'e',  'e',  'e',
  'e',   'e',  'e',  'e',  'e',
  'efw', 'ew', 'ew', 'ew', 'w',
  'w',   'w',  'x',  'x',  'x'
];
const battlemageCriteria = ['a','e','e','w'];

const siteDeckWildCards = ['aef', 'aew','aefw', 'x', 'y'];

//const combos = generateCombinations(battlemageCriteria, battlemageSiteDeck, 1);
const combos = await generateCombinations(battlemageSiteDeck, battlemageCriteria, 3, false);

//const validate = combinationValidator(["aefw","x","y"],battlemageCriteria);

process.stdout.write(JSON.stringify(combos.length) + '\n');

// old: 128
// new: 68