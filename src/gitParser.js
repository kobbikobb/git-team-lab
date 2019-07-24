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
  const shortstatsSum = sumShortstats(userLogs);

  return {
    ...shortstatsSum,
    numberOfIssues: countNumberOfIssues(userLogs),
    numberOfCommits: userLogs.length
  };
}

module.exports = {
  parseShortstat,
  parseIssueKey,
  sumShortstats,
  parseUserStats
};
