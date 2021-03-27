/**
 * TODO: README documentation
 *
 */

const fs = require("fs");

const lineReader = require("line-reader");
const lineReplace = require("line-replace");
const { argv0 } = require("process");

/**
 * Replace line lineNumber by newLine in filepath
 * @param  filepath: file to modify
 * @param  linesplit : LineToWrite
 * @param  lineNumber : line to modify
 */
function replaceLine(filepath, newLine, lineNumber) {
  lineReplace({
    file: filepath,
    line: lineNumber,
    text: newLine,
    addNewLine: false,
    callback: ({ file, line, text, replaceText, error }) => {
      if (error) console.log(`ERR: ${error}`);
    },
  });
}

/**
 * build Md table line
 * @param linesplit: array of word
 * @returns md format line
 */
function buildMdTableLine(linesplit) {
  linesplit[linesplit.length - 1] = "✔️";
  let newLine = "|";
  linesplit.forEach((element) => {
    newLine += element;
    newLine += "|";
  });
  newLine += "\n";
  return newLine;
}

/**
 * Search line wich contain pkmn number information and modify it
 * @param {*} file: file to modify
 * @param {*} numPkmn: pokemon to search
 */
function searchAndReplace(file, numPkmn) {
  lineReader.open(file, (err, reader) => {
    if (err) throw err;
    let i = 1;
    let found = false;
    while (reader.hasNextLine() && !found) {
      reader.nextLine((error, line) => {
        if (error) throw err;
        let linesplit = line.split("|");
        linesplit = linesplit.filter(
          (element) => element !== "" && element !== " "
        );
        if (linesplit[0] === numPkmn) {
          found = true;
          const newLine = buildMdTableLine(linesplit);
          replaceLine(file, newLine, i);
        }
        i++;
      });
    }
    if (!found) {
      console.log(`${numPkmn} is not in input file`);
    }
    reader.close((error) => {
      if (error) throw err;
    });
  });
}

function displayHelp() {
  console.log("RUN:");
  console.log("\twith node : node src/CheckPokemon file.md pkmnNumber");
  console.log("\tlinux script : catchPkmn file.md pkmnNumber");
  console.log("\tw10 script: WIP");
  console.log("\n");
  console.log("PARAMETER");
  console.log(
    "\tfile.md: filepath to md output of getuncaugthPokemon\n" +
      "\tpkmnNumber: number of the catch pokemon\n"
  );
}

function main(argv) {
  if (argv.includes["-h"]) {
    displayHelp();
    return;
  }
  if (argv.length < 2) {
    console.log("Not enought arguments");
    displayHelp();
    return;
  }
  /**Check input file exist */
  if (!fs.existsSync(argv[0])) {
    console.log(`ERR: ${argv[0]} don't exist`);
    return;
  }
  searchAndReplace(argv[0], argv[1]);
}

main(process.argv.splice(2));
