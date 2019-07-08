const fs = require("fs");
const { getDateRanges } = require("./argumentParser");
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

async function doReport() {
  const dateRanges = getDateRanges(process.argv);

  for (let i = 0; i < dateRanges.length; i++) {
    const { since, until } = dateRanges[i];
    writeInfo(
      `Generating report since ${since} until ${until || "..."}.`
    ).andBreak();
    const report = await getTeamReport(users, repos, since, until);
    writeSimpleFormatToConsole(report);
  }
}

doReport();
