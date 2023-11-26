const fs = require("fs");
const ArgumentsWrapper = require("./ArgumentsWrapper");
const { getAllUsernames, getSimpleReport, getReport } = require("./gitReport");
const {
  writeSimpleFormatToConsole,
  writeReportToConsole
} = require("./reportTemplate");
const { writeText, writeInfo } = require("./consoleWriter");

async function doReport() {
  const argumentsWrapper = new ArgumentsWrapper(process.argv);
  const dateInterval = argumentsWrapper.getDateInterval();

  const repos = getRepos();
  const users = await getUsers(repos, dateInterval);

  if (argumentsWrapper.isListReport()) {
    doListReport(users, repos, dateInterval);
  } else {
    doSimpleReport(users, repos, dateInterval);
  }
}

async function doListReport(users, repos, dateInterval) {
  const { since, until } = dateInterval;
  writeInfo(
    `Generating report since ${since} until ${until || "..."}.`
  ).andBreak();

  const report = await getReport(users, repos, dateInterval);
  writeReportToConsole(report);
}

async function doSimpleReport(users, repos, dateInterval) {
  writeText('Simple report')
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

function getRepos() {
  const repos = getFileLines("repos.txt");
  writeInfo("Target repositories").andLines(repos).andBreak();
  return repos;
}

async function getUsers(repos, dateInterval) {
  const users = getFileLines("users.txt");
  if(users.length > 0) {
    writeInfo("Target users from users.txt").andLines(users).andBreak();
    return users;
  }
  const { since, until } = dateInterval;

  const allUsernames = await getAllUsernames(repos, since, until);
  writeInfo("Target usernames").andLines(users).andBreak();
  return allUsernames;
}

function getFileLines(fileName) {
  return fs.readFileSync(fileName, "utf8").toString()
    .split("\n").filter(line => line.length > 0);
}

doReport();
