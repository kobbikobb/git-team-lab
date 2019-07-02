const { getUserLog, parseUserStats } = require("./gitUtils");

async function getUserStatsForRepo(repo, user, since) {
  const userLog = await getUserLog({
    path: repo,
    author: user,
    since: since
  });

  return parseUserStats(userLog);
}

async function getUserStatsForAllRepos(repos, user, since) {
  const allUserStats = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const userStats = await getUserStatsForRepo(repo, user, since);
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

async function getTeamReport(users, repos, since) {
  const report = {};
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const allUserStats = await getUserStatsForAllRepos(repos, user, since);

    report[user] = sumUserStats(allUserStats);
  }
  return report;
}

module.exports = {
  getTeamReport
};
