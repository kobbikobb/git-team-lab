const fs = require("fs");
const { getDateInterval } = require("./argumentParser2");
const { getReport } = require("./gitReport");
const { writeReportToConsole } = require("./reportTemplate");
const { writeText, writeInfo } = require("./consoleWriter");

writeText("Reading settings from users.txt and repos.txt").andBreak();

var users = fs
  .readFileSync("users.txt", "utf8")
  .toString()
  .split("\n");
var repos = fs
  .readFileSync("repos.txt", "utf8")
  .toString()
  .split("\n");

writeInfo("Target users")
  .andLines(users)
  .andBreak();
writeInfo("Target repositories")
  .andLines(repos)
  .andBreak();

async function doReport() {
  const dateInterval = getDateInterval(process.argv);

  const { since, until } = dateInterval;
  writeInfo(
    `Generating report since ${since} until ${until || "..."}.`
  ).andBreak();

  const report = await getReport(users, repos, dateInterval);
  writeReportToConsole(report);
}

doReport();
