const git = require("simple-git");

const FILES_REGEX = /([0-9]*) file[sS]? changed*/;
const INSERTIONS_REGEX = /([0-9]*) insertion[sS]?\(\+\)*/;
const DELETIONS_REGEX = /([0-9]*) deletion[sS]?\(\-\)*/;
const ISSUE_REGEX = /^(([A-Z]*)\-?([0-9]*)) _*/;

function getNumberOfFiles(hash) {
  const filesMatches = hash.match(FILES_REGEX);
  if (!filesMatches) {
    return 0;
  }
  return parseInt(filesMatches[1], 10);
}

function getNumberOfNewLines(hash) {
  const insertionsMatches = hash.match(INSERTIONS_REGEX);
  if (!insertionsMatches) {
    return 0;
  }
  return parseInt(insertionsMatches[1], 10);
}

function getNumberOfDeletedLines(hash) {
  const deletionsMatches = hash.match(DELETIONS_REGEX);
  if (!deletionsMatches) {
    return 0;
  }
  return parseInt(deletionsMatches[1], 10);
}

/* Returns a object with shortstat from hash string */
function parseShortstat(hash) {
  if (hash === null) {
    return null;
  }

  return {
    numberOfFiles: getNumberOfFiles(hash),
    numberOfNewLines: getNumberOfNewLines(hash),
    numberOfDeletedLines: getNumberOfDeletedLines(hash)
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

function startOfDayIfTimeMissing(date) {
  if (!date) {
    return undefined;
  }
  if (date.length !== 10) {
    return date;
  }
  return date + " 00:00:00 +0000";
}

// NOTE: There is a bug when using git log and shortstat, the stats go to the nexts line
// and there is a extra line
function withShortstatShiftedUp(userLog) {
  if (userLog.all.length === 0) {
    return userLog;
  }
  // Only assume it is flawed if date and log are empty in the last itme
  if (
    userLog.all[userLog.all.length - 1].date !== "" &&
    userLog.all[userLog.all.length - 1].message !== ""
  ) {
    return userLog;
  }
  for (let i = 0; i < userLog.all.length - 1; i++) {
    const currentHash = userLog.all[i].hash;
    const nextHash = userLog.all[i + 1].hash;
    const currentSplit = currentHash.split("\n\n");
    const nextSplit = nextHash.split("\n\n");

    userLog.all[i].hash =
      nextSplit[0] +
      "\n\n" +
      (currentSplit.length === 1 ? currentSplit[0] : currentSplit[1]);
  }

  // Remove last item
  userLog.all.splice(-1, 1);
  userLog.total = userLog.total - 1;

  return userLog;
}

/* Returns user logs since a date: {
    all: [{
        hash: '2 files changed, 9 insertions(+), 6 deletions(-)\n\n38acece884941597ffcb56640af4a390e6034d52',
        date: '2019-06-30 23:57:58 +0000',
        message: 'First commit',
    }],
    total: 3,
} */
function getUserLog({ path, author, since, until }) {
  return new Promise((resolve, reject) => {
    git(path).log(
      [
        `--author=${author}`,
        `--since=${startOfDayIfTimeMissing(since)}`,
        `--until=${startOfDayIfTimeMissing(until)}`,
        "--shortstat",
        "--no-merges", // No Merge Commits
        "--all" // All Branches
      ],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(withShortstatShiftedUp(result));
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
  withShortstatShiftedUp,
  getUserLog
};
