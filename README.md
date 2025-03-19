# sorcery-threshold
CLI tool for determining odds of resources in the CCG Sorcery.

![Example output](example.png)

## Background
[Sorcery: Contested Realm](https://sorcerytcg.com/) is a trading/collectibe card game. The game uses a deck of cards, called Sites, as resources. These resources have attributes correlating to the four alchemical elements: Air, Earth, Fire, and Water. Playable cards (Spells) require a certain 'threshold' of symbols present on sites.

When constructing a 30-card Atlas deck for the game, I wanted to know the odds of having a particular configuration of symbols on turn four. This tool provides that information.

## Prerequisites
Node lts/iron 20.18.3

You must provide a list.txt file containing the sites in your deck in for format of:
```
3x Steppe
1x Mirror Realm
4x Hunter's Lodge
```

Feel free to alter the list.txt that is included as a template.

## How To Use

`npm install`

`node index.js`

This will run the 'base' version of the tool using the dataset of Beta and Arthurian Legends sets provided by the Sorcery API.

You will be prompted to provide the criteria in terms of symbols needed. The tool will then perform a [multivariate hypergeometric distribution](https://en.wikipedia.org/wiki/Hypergeometric_distribution#Multivariate_hypergeometric_distribution) calculation to provide the odds of getting that criteria in the same number of cards drawn.

### Flags

`--simulate` will perform a [Monte Carlo Simulation](https://en.wikipedia.org/wiki/Monte_Carlo_method) instead. This is useful to corroborate the results of the MHD calculation. Use the `--iterations` flag to set the number of iterations; default is 1000.

`--drawCount n` flag, when passed in with a number, will instead calculate the odds of getting the specific threshold in a number greater than exact draw count needed. For example, `--drawCount 7` will return odds for getting `a, e, e, w` in 7 draws instead of 4. This is useful for understanding odds in the context of mulligans or additional turns needed. Only works with the `--simulate` flag for now.

`--wild` will alter the generated `threshold-data.json` file by swapping blank entries for certain sites with values of `aefw`. This can be useful because certain sites are listed in the official dataset as providing no threshold, when in fact they do under certain circumstances. Valley of Delight, for example, asks the player to choose an element when it comes into play. There is a curated list of sites that can be converted from having null threshold values to maximum by using this flag.

`--forceNew` will simply re-create the `threshold-data.json` file. Most likely used in conjunction with `--wild`.

`--save` will save the chosen threshold criteria to `./criteria.json` so you don't need to go through the prompt process every time. Simply delete the file when you want to use new values.

