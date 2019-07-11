const { getUserLog, parseUserStats } = require("./gitUtils");

function appendStartOfDayToIsoDate(date) {
  return date + " 00:00:00 +0000";
}

async function getUserStatsForRepo(repo, user, since, until) {
  const userLog = await getUserLog({
    path: repo,
    author: user,
    since: since ? appendStartOfDayToIsoDate(since) : undefined,
    until: until ? appendStartOfDayToIsoDate(until) : undefined
  });

  console.log(userLog);

  console.log(since ? appendStartOfDayToIsoDate(since) : undefined);
  console.log(until ? appendStartOfDayToIsoDate(until) : undefined);
  return parseUserStats(userLog);
}

async function getUserStatsForAllRepos(repos, user, since, until) {
  const allUserStats = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const userStats = await getUserStatsForRepo(repo, user, since, until);
    allUserStats.push(userStats);
  }
  return allUserStats;
}

function sumUserStats(allUserStats) {
  if (allUserStats.length === 0) {
    return {
      numberOfFiles: 0,
      numberOfNewLines: 0,
      numberOfDeletedLines: 0,
      numberOfIssues: 0,
      numberOfCommits: 0
    };
  }

  return allUserStats.reduce((a, b) => {
    return {
      numberOfFiles: a.numberOfFiles + b.numberOfFiles,
      numberOfNewLines: a.numberOfNewLines + b.numberOfNewLines,
      numberOfDeletedLines: a.numberOfDeletedLines + b.numberOfDeletedLines,
      numberOfIssues: a.numberOfIssues + b.numberOfIssues,
      numberOfCommits: a.numberOfCommits + b.numberOfCommits
    };
  });
}

async function getTeamReport(users, repos, since, until) {
  const report = {};
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const allUserStats = await getUserStatsForAllRepos(
      repos,
      user,
      since,
      until
    );

    report[user] = sumUserStats(allUserStats);
  }
  return report;
}

module.exports = {
  getTeamReport
};
