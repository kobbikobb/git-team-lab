const { getAllLogsPerUser } = require("./gitAggregator");
const { parseUserStats } = require("./gitParser");
const { getUsernames } = require("./gitReader");

async function getAllUsernames(repos, since, until) {
  const allUsernames = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoUsernames = await getUsernames({repo, since, until});

    allUsernames.push(...repoUsernames);
  }
  return allUsernames;
}

async function getSimpleReport(users, repos, since, until) {
  const report = {};

  const allLogsPerUser = await getAllLogsPerUser(users, repos, since, until);
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
  const report = {};
  dateInterval.intervals.forEach(interval => {
    report[interval.key] = getReportInterval(allLogsPerUser, users, interval);
  });

  return report;
}

module.exports = {
  getAllUsernames,
  getSimpleReport,
  getReport
};
