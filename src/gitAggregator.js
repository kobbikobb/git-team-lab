const { getUserLog } = require("./gitReader");

async function getUserLogs(repo, user, since, until) {
  const userLog = await getUserLog({
    path: repo,
    author: user,
    since: since,
    until: until
  });
  return userLog.all;
}

async function getAllUserLogs(repos, user, since, until) {
  const allUserLogs = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const userLogs = await getUserLogs(repo, user, since, until);
    allUserLogs.push(...userLogs);
  }
  return allUserLogs;
}

async function getAllLogsPerUser(users, repos, since, until) {
  const allLogsPerUser = {};
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    allLogsPerUser[user] = await getAllUserLogs(repos, user, since, until);
  }
  return allLogsPerUser;
}

module.exports = {
  getAllLogsPerUser
};
