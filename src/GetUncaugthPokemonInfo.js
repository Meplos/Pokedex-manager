const fs = require("fs");
const puppeteer = require("puppeteer");

/**
 * Description of all generation pokedex
 * @param url: pokebip url of the génération
 * @param pokenumber: index of pokemon number field in the pokedex
 * @param pokename: index of pokemon name field in the pokedex
 * @param pokelocate: index of pokemon location field in the pokedex
 */
const genMap = {
  1: {
    url: "https://www.pokebip.com/page/jeuxvideo/rbvj/pokedex_kanto",
    pokenumber: 0,
    pokename: 1,
    pokelocate: 4,
  },

  2: {
    url: "https://www.pokebip.com/page/jeuxvideo/oac/or_argent/pokedex",
    pokenumber: 0,
    pokename: 1,
    pokelocate: 4,
  },

  3: {
    url: "https://www.pokebip.com/page/jeuxvideo/rse/pokedex-regional",
    pokenumber: 0,
    pokename: 1,
    pokelocate: 4,
  },

  4: {
    url: "https://www.pokebip.com/page/jeuxvideo/dp/pokedex-national",
    pokenumber: 0,
    pokename: 2,
    pokelocate: 4,
  },
  5: {
    url:
      "https://www.pokebip.com/page/jeuxvideo/pokemon_noir_black_blanc_white/pokedex-national",
    pokenumber: 0,
    pokename: 2,
    pokelocate: 4,
  },
  6: {
    url: "https://www.pokebip.com/page/jeuxvideo/pokemon-x-y/pokedex_regional",
    pokenumber: 0,
    pokename: 3,
    pokelocate: 6,
  },
  7: {
    url:
      "https://www.pokebip.com/page/jeuxvideo/pokemon_ultra_soleil_ultra_lune/pokedex_alola",
    pokenumber: 0,
    pokename: 2,
    pokelocate: 5,
  },
  8: {
    url:
      "https://www.pokebip.com/page/jeuxvideo/pokemon-epee-bouclier/pokedex-galar",
    pokenumber: 0,
    pokename: 2,
    pokelocate: 5,
  },
  IOA: {
    url:
      "https://www.pokebip.com/page/jeuxvideo/pokemon-epee-bouclier/pass-d-extension/pokedex-isolarmure",
    pokenumber: 0,
    pokename: 3,
    pokelocate: 4,
  },
  CT: {
    url:
      "https://www.pokebip.com/page/jeuxvideo/pokemon-epee-bouclier/pass-d-extension/pokedex-couronneige",
    pokenumber: 0,
    pokename: 3,
    pokelocate: 4,
  },
};

/**
 * Read csv file and return array
 * @param file: path of input csv file
 * @returns array of number
 */
function readPkmnIndex(file) {
  const SEPARATOR = ";";
  const buffer = fs.readFileSync(file);
  const list = buffer.toString().split(SEPARATOR);
  return list;
}

/**
 * extract all data from pokebip.com with puppeteer
 * @param url: url of pokedex asked
 * @returns all pokedex information (depends of generation)
 */
async function getPokedex(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  const pkdx = await page.evaluate(() => {
    let pkdxs = new Array();
    const allTable = document.querySelectorAll("table.bipcode");
    for (let iTable = 0; iTable < allTable.length; iTable++) {
      /** Browse all "pokedex" table of the page */
      const current = allTable[iTable].rows;
      let map = new Array();
      for (let index = 1; index < current.length; index++) {
        const pkmn = current[index];
        map[index - 1] = new Array();
        for (let i = 0; i < pkmn.cells.length; i++) {
          map[index - 1][i] = pkmn.cells[i].innerText;
        }
      }
      pkdxs[iTable] = map;
    }

    pkdxs = pkdxs.reduce((accumulator, currentValue) =>
      accumulator.concat(currentValue)
    );
    return pkdxs;
  });

  await browser.close();
  return pkdx;
}
/**
 * Write uncaugthed pokemon information in markdown table
 * @param uncaugthed: pokemon uncaugthed by the user
 * @param filename: file to write
 * @param gen: generation object
 */
function writeMarkdown(uncaugthed, filename, gen) {
  fs.writeFileSync(filename, "|Num.|Name|Location|Done?|\n");
  fs.appendFileSync(filename, "|---|---|---|---|\n");
  for (let i = 0; i < uncaugthed.length; i++) {
    fs.appendFileSync(
      filename,
      "|" +
        uncaugthed[i][gen.pokenumber] +
        "|" +
        uncaugthed[i][gen.pokename] +
        "|" +
        uncaugthed[i][gen.pokelocate].replace("\n", " ") +
        "|❌|\n"
    );
  }
}
/**
 * Get uncaugth pokemon information
 * @param  uncaugthedIndexList: list of number
 * @param  pkdx: all pokedex information
 * @returns list of all pokemon uncaugthed by the user
 */
function getuncaugthed(uncaugthedIndexList, pkdx) {
  let uncaugthed = [];
  for (let i = 0; i < uncaugthedIndexList.length; i++) {
    if (!pkdx[uncaugthedIndexList[i] - 1]) {
      console.log(
        `POKEMON N°${uncaugthedIndexList[i]} doesn't exist in this generation`
      );
      continue;
    }
    uncaugthed[i] = pkdx[uncaugthedIndexList[i] - 1];
  }
  return uncaugthed;
}

function displayHelp() {
  console.log("RUN:");
  console.log(
    "\twith node : node src/GetuncaugthPokemon input.csv out.md genVersion"
  );
  console.log(
    "\tlinux script : getuncaugthPokemon input.csv out.md genVersion"
  );
  console.log("\tw10 script: WIP");
  console.log("\n");
  console.log("PARAMETER");
  console.log(
    "\tinput.csv: filepath to ; separated number. represent pokemon number in the pokedex.\n" +
      "\tout.md: file to write table in markdown format\n" +
      "\tgenVersion: version flags supported by this app. See README for more details"
  );
}

function main(argv) {
  if (argv.includes("-h")) {
    displayHelp();
    return;
  } else if (argv.length < 3) {
    console.log("ERROR: wrong Number of arguments");
    displayHelp();
    return;
  }

  /**Check input file exist */
  if (!fs.existsSync(argv[0])) {
    console.log(`ERR: ${argv[0]} don't exist`);
    return;
  }

  const indexList = readPkmnIndex(argv[0]);
  const gen = genMap[argv[2]];
  if (!gen) {
    console.log(`ERROR: ${argv[2]} is not supported`);
    return;
  }
  getPokedex(gen.url).then((res) => {
    const missPokemon = getuncaugthed(indexList, res);
    writeMarkdown(missPokemon, argv[1], gen);
  });
}
main(process.argv.slice(2));
