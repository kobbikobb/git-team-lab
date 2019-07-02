const fs = require("fs");
const { getTeamReport } = require("./gitReport");

console.log("---------------------------");
console.log("Reading settings from users.txt and repos.txt");
var users = fs
  .readFileSync("users.txt", "utf8")
  .toString()
  .split("\n");
var repos = fs
  .readFileSync("repos.txt", "utf8")
  .toString()
  .split("\n");

console.log("---------------------------");
console.log("Target users", users);
console.log("Target repositories", repos);

console.log("---------------------------");
console.log("Generating report");

const since =
  process.argv.slice(2) || new Date().toISOString().substring(0, 10);

getTeamReport(users, repos, since).then(report => {
  console.log("---------------------------");
  console.log("Report");
  console.log(report);
});
