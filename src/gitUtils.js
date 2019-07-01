const git = require("simple-git");

/* Parses user stats from user logs: {
    numberOfCommits: 3,
    numberOfIssues: 1
    numberOfNewLines: 344,
    numberOfDeletedLines: 344,
    numberOfFilesChanged: 3,
} */
function parseUserStats(userLogs) {
  return null;
}

/* Returns user logs since a date: {
    all: [{
        hash: '2 files changed, 9 insertions(+), 6 deletions(-)\n\n38acece884941597ffcb56640af4a390e6034d52',
        date: '2019-06-30 23:57:58 +0000',
        message: 'First commit',
    }],
    total: 3,
} */
function getUserLog({ path, author, since }) {
  return new Promise((resolve, reject) => {
    git(path).log(
      [`--author=${author}`, `--since=${since}`, "--no-merges", "--shortstat"],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  parseUserStats,
  getUserLog
};
