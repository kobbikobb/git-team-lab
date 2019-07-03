const FG_WHITE = "\x1b[37m";
const FG_CYAN = "\x1b[36m";
const FG_GREEN = "\x1b[32m";
const FG_YELLOW = "\x1b[33m";

function writeText(text) {
  console.log(FG_WHITE, text);

  return {
    andBreak
  };
}

function andBreak() {
  console.log();
}

function andLines(lines) {
  lines.forEach(line => writeText(line));
  return {
    andBreak
  };
}

function writeInfo(text) {
  console.log(FG_CYAN, text);
  return {
    andLines,
    andBreak
  };
}

function writeHeader(text) {
  console.log(FG_GREEN, text);

  return {
    andLines: lines => {
      lines.forEeach(line => console.log(FG_GREEN, line));
    }
  };
}

function writeSubHeader(text) {
  console.log(FG_YELLOW, text);
  return {
    andLines
  };
}

module.exports = {
  writeText,
  andBreak,
  writeInfo,
  writeHeader,
  writeSubHeader
};
