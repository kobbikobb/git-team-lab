const git = require("simple-git");

const SHORTSTAT_REGEX = /([0-9]*) files changed, ([0-9]*) insertions\(\+\), ([0-9]*) deletions\(\-\)_*/;
const ISSUE_REGEX = /^(([A-Z]*)\-?([0-9]*)) _*/;

/* Returns a object with shortstat from hash string */
function parseShortstat(hash) {
  if (hash === null) {
    return null;
  }
  const matches = hash.match(SHORTSTAT_REGEX);
  if (matches < 4) {
    return null;
  }
  return {
    numberOfFiles: parseInt(matches[1], 10),
    numberOfNewLines: parseInt(matches[2], 10),
    numberOfDeletedLines: parseInt(matches[3], 10)
  };
}

/* Parse a issue key from a message */
function parseIssueKey(message) {
  if (message === null) {
    return null;
  }
  const matches = message.match(ISSUE_REGEX);
  if (matches === null || matches < 1) {
    return null;
  }

  return matches[1];
}

/* Given a array of logs, calculates the shortstat sum for them */
function sumShortstats(logs) {
  const shortstats = logs
    .map(log => parseShortstat(log.hash))
    .filter(log => log !== null);

  if (shortstats.length === 0) {
    return {
      numberOfFiles: 0,
      numberOfNewLines: 0,
      numberOfDeletedLines: 0
    };
  }

  return shortstats.reduce((a, b) => {
    return {
      numberOfFiles: a.numberOfFiles + b.numberOfFiles,
      numberOfNewLines: a.numberOfNewLines + b.numberOfNewLines,
      numberOfDeletedLines: a.numberOfDeletedLines + b.numberOfDeletedLines
    };
  });
}

/* Given a array of logs, counts the number of unique issues */
function countNumberOfIssues(logs) {
  const issueKeys = logs
    .map(log => parseIssueKey(log.message))
    .filter(issueKey => issueKey !== null);

  if (issueKeys.length < 1) {
    return 0;
  }

  return [...new Set(issueKeys)].length;
}

/* Parses user stats from user logs: {
    numberOfCommits: 3,
    numberOfIssues: 1
    numberOfNewLines: 344,
    numberOfDeletedLines: 344,
    numberOfFiles: 3,
} */
function parseUserStats(userLogs) {
  const { all } = userLogs;

  const shortstatsSum = sumShortstats(all);

  return {
    ...shortstatsSum,
    numberOfIssues: countNumberOfIssues(all),
    numberOfCommits: all.length
  };
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
  parseShortstat,
  parseIssueKey,
  sumShortstats,
  parseUserStats,
  getUserLog
};
