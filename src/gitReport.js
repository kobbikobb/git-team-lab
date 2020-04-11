const { getAllLogsPerUser } = require("./gitAggregator");
const { sumUserStats, avgUserStats, medUserStats } = require("./gitParser");

function getUserStatsParser(statsType) {
  if (statsType === "avg") {
    return avgUserStats;
  }
  if (statsType === "med") {
    return medUserStats;
  }
  return sumUserStats;
}

async function getTeamReport(users, repos, since, until, statsType) {
  const report = {};
  const allLogsPerUser = await getAllLogsPerUser(users, repos, since, until);
  const userStatsParser = getUserStatsParser(statsType);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    report[user] = userStatsParser(allLogsPerUser[user]);
  }
  return report;
}

function getReportInterval(allLogsPerUser, users, interval, statsType) {
  const reportInterval = {};
  const userStatsParser = getUserStatsParser(statsType);
  users.forEach((user) => {
    const userLogs = allLogsPerUser[user];
    const userLogsInInterval = userLogs.filter((log) =>
      interval.contains(log.date)
    );
    reportInterval[user] = userStatsParser(userLogsInInterval);
  });
  return reportInterval;
}

async function getReport(users, repos, dateInterval, statsType) {
  const allLogsPerUser = await getAllLogsPerUser(
    users,
    repos,
    dateInterval.since,
    dateInterval.until
  );
  const report = {};
  dateInterval.intervals.forEach((interval) => {
    report[interval.key] = getReportInterval(
      allLogsPerUser,
      users,
      interval,
      statsType
    );
  });

  console.log(report);
  return report;
}

module.exports = {
  getTeamReport,
  getReport,
};
