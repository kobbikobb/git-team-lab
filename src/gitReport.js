const { getAllLogsPerUser } = require("./gitAggregator");
const { parseUserStats } = require("./gitParser");

async function getTeamReport(users, repos, since, until) {
  const report = {};
  const allLogsPerUser = await getAllLogsPerUser(users, repos, since, until);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    report[user] = parseUserStats(allLogsPerUser[user]);
  }
  return report;
}

module.exports = {
  getTeamReport
};
