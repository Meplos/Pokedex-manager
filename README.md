# Pokemon Listing

## Description

- **GetuncaugthPokemonInfo**: Allow user to easily get info from pokemon which were not in already in pokedex like name and location.

- **CatchPokemon**: After generate file with _GetuncaugthPokemonInfo_, you can easily modify done colone to check pokemon you caugth.

## Dependencies

| Package      | Version |
| ------------ | ------- |
| node         | 15.1.0  |
| npm          | 6.14.8  |
| Puppeteer    | 8.0.0   |
| line-reader  | 0.4.0   |
| line-replace | 2.0.1   |

## Install & Use

```
$ npm i
$ node ./src/GetUncaugthPokemonInfo.js listing.csv out.md genversion
$ node ./src/CatchPokemon.js out.md pkmnNumber

```

### Use on linux

Add getuncaugthPokemon launch script to your PATH.

```
$ export PATH=/install/dir/script:${PATH}
$ getuncaugthPokemonInfo listing.csv out.md genversion
$ catchPkmn out.md pkmnNumber

```

### Arguments

- **listing.csv**: list of regional pokemon index in csv format. 1;23;151;...
- **out.md**: file path where write result in md format. Info are written in md tab in format:

| Num | Name | Location | Done |
| --- | ---- | -------- | ---- |

- **genversion**: pokemon génération number.
  Supported version:

  | Generation    | Parameter |
  | ------------- | --------- |
  | RGBY          | 1         |
  | GSC           | 2         |
  | FR-LG-SRE     | 3         |
  | DPP-HG-SS     | 4         |
  | BW            | 5         |
  | MS-US-UM      | 7         |
  | SS            | 8         |
  | Isle of armor | IOA       |
  | Crown tundra  | CT        |

- **pkmnNumber**: number of the pokemon in the pokedex.
