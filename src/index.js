const fs = require("fs");
const ArgumentsWrapper = require("./ArgumentsWrapper");
const { getSimpleReport, getReport } = require("./gitReport");
const {
  writeSimpleFormatToConsole,
  writeReportToConsole
} = require("./reportTemplate");
const { writeText, writeInfo } = require("./consoleWriter");

writeText("Reading settings from users.txt and repos.txt").andBreak();

var users = fs.readFileSync("users.txt", "utf8").toString().split("\n");
var repos = fs.readFileSync("repos.txt", "utf8").toString().split("\n");

writeInfo("Target users").andLines(users).andBreak();
writeInfo("Target repositories").andLines(repos).andBreak();

async function doListReport(dateInterval) {
  const { since, until } = dateInterval;
  writeInfo(
    `Generating report since ${since} until ${until || "..."}.`
  ).andBreak();

  const report = await getReport(users, repos, dateInterval);
  writeReportToConsole(report);
}

async function doSimpleReport(dateInterval) {
  for (let i = 0; i < dateInterval.intervals.length; i++) {
    const interval = dateInterval.intervals[i];
    const { since, until } = interval;
    writeInfo(
      `Generating report since ${since} until ${until || "..."}.`
    ).andBreak();
    const report = await getSimpleReport(users, repos, since, until);
    writeSimpleFormatToConsole(report);
  }
}

async function doReport() {
  const argumentsWrapper = new ArgumentsWrapper(process.argv);
  const dateInterval = argumentsWrapper.getDateInterval();

  if (argumentsWrapper.isListReport()) {
    doListReport(dateInterval);
  } else {
    doSimpleReport(dateInterval);
  }
}

doReport();
