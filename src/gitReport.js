const { getAllLogsPerUser } = require("./gitAggregator");
const { parseUserStats } = require("./gitParser");

async function getReportByUser(users, repos, since, until) {
  const report = {};
  const allLogsPerUser = await getAllLogsPerUser(users, repos, since, until);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    report[user] = parseUserStats(allLogsPerUser[user]);
  }
  return report;
}

function groupLogsByDay(logs) {
  const grouping = {};
  logs.forEach(log => {
    const date = log.date.substring(0, 10); // yyyy-MM-DD ....
    if (!grouping[date]) {
      grouping[date] = [];
    }
    grouping[date].push(log);
  });
  return grouping;
}

async function getReportByDayThenUser(users, repos, since, until) {
  const report = {};
  const allLogsPerUser = await getAllLogsPerUser(users, repos, since, until);

  const defaultDay = {};
  users.forEach(user => {
    defaultDay[user] = null;
  });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const userLogsByDate = groupLogsByDay(allLogsPerUser[user]);

    for (let day in userLogsByDate) {
      if (!report[day]) {
        report[day] = { ...defaultDay };
      }
      report[day][user] = parseUserStats(userLogsByDate[day]);
    }
  }
  return report;
}

module.exports = {
  getReportByUser,
  getReportByDayThenUser
};
