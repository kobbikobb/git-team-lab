const fs = require("fs");
const { getTeamReport } = require("./gitReport");
const { writeSimpleFormatToConsole } = require("./reportTemplate");
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

function toIso(date) {
  return date.toISOString().substring(0, 10);
}

function addMonth(date) {
  return new Date(new Date(date).setMonth(date.getMonth() + 1));
}

function getReportDateRanges() {
  const since = process.argv[2];
  const interval = process.argv[3];

  if (interval === "month") {
    const dateRanges = [];

    let targetDate = new Date(since);

    while (targetDate < new Date()) {
      dateRanges.push({
        since: toIso(targetDate),
        until: toIso(addMonth(targetDate))
      });
      targetDate = addMonth(targetDate);
    }

    return dateRanges;
  }

  return [
    {
      since: since || toIso(new Date()),
      until: null
    }
  ];
}
async function doReport() {
  const dateRanges = getReportDateRanges();

  for (let i = 0; i < dateRanges.length; i++) {
    const { since, until } = dateRanges[i];
    writeInfo(`Generating report since ${since} until ${until}.`).andBreak();
    const report = await getTeamReport(users, repos, since, until);
    writeSimpleFormatToConsole(report);
  }
}

doReport();
