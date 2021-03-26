/**
 * TODO: Add display Help
 * TODO: check wrong file
 * TODO: check wrong number
 * TODO: README documentation
 *
 */

const fs = require("fs");

const lineReader = require("line-reader");
const lineReplace = require("line-replace");

function replaceLine(filepath, linesplit, lineNumber) {
  linesplit[linesplit.length - 1] = "✔️";
  let newLine = "|";
  linesplit.forEach((element) => {
    newLine += element;
    newLine += "|";
  });
  newLine += "\n";
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
function getNumLineToReplace(file, numPkmn) {
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

          replaceLine(file, linesplit, i);
        }
        i++;
      });
    }
    reader.close((error) => {
      if (error) throw err;
    });
  });
}

function main(argv) {
  if (argv.length < 2) {
    console.log("Not enought arguments");
    return;
  }
  getNumLineToReplace(argv[0], argv[1]);
}

main(process.argv.splice(2));
