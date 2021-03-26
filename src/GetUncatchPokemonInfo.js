const fs = require("fs");
const puppeteer = require("puppeteer");

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

function readPkmnIndex(file) {
  const SEPARATOR = ";";
  const buffer = fs.readFileSync(file);
  const list = buffer.toString().split(SEPARATOR);
  return list;
}

async function getPokedex(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  const pkdx = await page.evaluate(() => {
    const table = document.querySelectorAll("table.bipcode")[0].rows;
    let map = new Array();
    for (let index = 1; index < table.length; index++) {
      const pkmn = table[index];
      map[index - 1] = new Array();
      for (let i = 0; i < pkmn.cells.length; i++) {
        map[index - 1][i] = pkmn.cells[i].innerText;
      }
    }
    return map;
  });
  await browser.close();
  return pkdx;
}

function writeMarkdown(missing, filename, gen) {
  fs.writeFileSync(filename, "|Num.|Name|Location|Done?|\n");
  fs.appendFileSync(filename, "|---|---|---|---|\n");
  for (let i = 0; i < missing.length; i++) {
    fs.appendFileSync(
      filename,
      "|" +
        missing[i][gen.pokenumber] +
        "|" +
        missing[i][gen.pokename] +
        "|" +
        missing[i][gen.pokelocate].replace("\n", " ") +
        "|❌|\n"
    );
  }
}

function getMissing(missingIndexList, pkdx) {
  let missing = [];
  for (let i = 0; i < missingIndexList.length; i++) {
    missing[i] = pkdx[missingIndexList[i] - 1];
  }
  return missing;
}

function main(argv) {
  const indexList = readPkmnIndex(argv[0]);
  const gen = genMap[argv[2]];
  if (!gen) {
    console.log(`ERROR: ${argv[2]} is not supported`);
    return;
  }
  console.log(gen);
  getPokedex(gen.url).then((res) => {
    const missPokemon = getMissing(indexList, res);
    writeMarkdown(missPokemon, argv[1], gen);
  });
}
main(process.argv.slice(2));
