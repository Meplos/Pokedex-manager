# Pokemon Listing

## Description

**GetUncatchPokemonInfo** is a script, which allow user to easily get info from pokemon which were not in already in pokedex like name and location.

## Dependencies

| Package   | Version |
| --------- | ------- |
| node      | 15.1.0  |
| Puppeteer | 8.0.0   |

## Install & Use

```
$ npm i
$ node GetUncatchPokemonInfo.js listing.csv out.md genversion
```

### Arguments

- **listing.csv**: list of regional pokemon index in csv format. 1;23;151;...
- **out.md**: file path where write result in md format. Info are written in md tab in format:

| Num | Name | Location | Done |
| --- | ---- | -------- | ---- |

- **genversion**: Pokemon génération number.
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
