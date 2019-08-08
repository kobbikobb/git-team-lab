const { getAllLogsPerUser } = require("./gitAggregator");
const { parseUserStats } = require("./gitParser");

async function getTeamReport(users, repos, since, until) {
  const report = {};
  const allLogsPerUser = await getAllLogsPerUser(users, repos, since, until);
  console.log(allLogsPerUser);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    report[user] = parseUserStats(allLogsPerUser[user]);
  }
  return report;
}

function getReportInterval(allLogsPerUser, users, interval) {
  const reportInterval = {};
  users.forEach(user => {
    const userLogs = allLogsPerUser[user];
    const userLogsInInterval = userLogs.filter(log =>
      interval.contains(log.date)
    );
    reportInterval[user] = parseUserStats(userLogsInInterval);
  });
  return reportInterval;
}

async function getReport(users, repos, dateInterval) {
  const allLogsPerUser = await getAllLogsPerUser(
    users,
    repos,
    dateInterval.since,
    dateInterval.until
  );
  console.log(allLogsPerUser);
  const report = {};
  dateInterval.intervals.forEach(interval => {
    report[interval.key] = getReportInterval(allLogsPerUser, users, interval);
  });

  return report;
}

module.exports = {
  getTeamReport,
  getReport
};
