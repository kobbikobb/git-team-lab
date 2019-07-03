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

  console.log("\x1b[35m", header);

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

    console.log("\x1b[32m", line);
  });
}

module.exports = {
  writeSimpleFormatToConsole
};
