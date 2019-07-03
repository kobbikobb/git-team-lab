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

const since =
  process.argv.slice(2) || new Date().toISOString().substring(0, 10);

writeInfo(`Generating report from ${since}`).andBreak();

getTeamReport(users, repos, since).then(report => {
  writeSimpleFormatToConsole(report);
});
