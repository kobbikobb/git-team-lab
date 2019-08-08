const { writeHeader, writeSubHeader, andBreak } = require("./consoleWriter");

function stringColumn(value, size = 15) {
  return value.padEnd(size);
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

function writeReportToConsole(report) {
  const intervalKeys = Object.keys(report);
  const userKeys = Object.keys(report[intervalKeys[0]]);

  let header = stringColumn("Date", 30);

  userKeys.forEach(userKey => {
    header += stringColumn(userKey, 30);
  });

  writeHeader(header);

  for (intervalKey in report) {
    const interval = report[intervalKey];

    let line = stringColumn(intervalKey, 30);

    for (userKey in interval) {
      const userStats = interval[userKey];

      const {
        numberOfNewLines,
        numberOfDeletedLines,
        numberOfCommits,
        numberOfIssues
      } = userStats;

      line += stringColumn(
        `+${numberOfNewLines}/-${numberOfDeletedLines} c${numberOfCommits}/i${numberOfIssues}`,
        30
      );
    }

    writeSubHeader(line);
  }
}

module.exports = {
  writeSimpleFormatToConsole,
  writeReportToConsole
};
