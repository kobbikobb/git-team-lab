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

function writeReportByDateToConsole(report) {
  let header = stringColumn("Date");
  const firstDate = Object.keys(report)[0];
  for (user in report[firstDate]) {
    header += stringColumn(user);
  }

  writeHeader(header);

  for (date in report) {
    const byDate = report[date];

    let line = stringColumn(date);

    for (user in byDate) {
      if (!byDate[user]) {
        line += stringColumn("");
      } else {
        const { numberOfNewLines, numberOfCommits } = byDate[user];

        line += stringColumn(
          numberOfCommits.toString() + " / " + numberOfNewLines.toString()
        );
      }
    }
    writeSubHeader(line);
  }
}

module.exports = {
  writeSimpleFormatToConsole,
  writeReportByDateToConsole
};
