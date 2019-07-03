const { writeHeader, writeSubHeader, andBreak } = require("./consoleWriter");

function stringColumn(value) {
  return value.padEnd(15);
}

function numberColumn(value) {
  return value.toString().padStart(15);
}

function writeSimpleFormatToConsole(report) {
  const header =
    stringColumn("Username") +
    numberColumn("Files") +
    numberColumn("New Lines") +
    numberColumn("Deleted Lines") +
    numberColumn("Commits") +
    numberColumn("Issues");

  writeHeader(header);

  const userNames = Object.keys(report);

  userNames.forEach(userName => {
    const {
      numberOfFiles,
      numberOfNewLines,
      numberOfDeletedLines,
      numberOfCommits,
      numberOfIssues
    } = report[userName];

    const line =
      stringColumn(userName) +
      numberColumn(numberOfFiles) +
      numberColumn(numberOfNewLines) +
      numberColumn(numberOfDeletedLines) +
      numberColumn(numberOfCommits) +
      numberColumn(numberOfIssues);

    writeSubHeader(line);
  });

  andBreak();
}

module.exports = {
  writeSimpleFormatToConsole
};
