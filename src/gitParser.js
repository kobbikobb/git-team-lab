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
    numberOfDeletedLines: getNumberOfDeletedLines(hash),
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

function getEmptyShortstats() {
  return {
    numberOfFiles: 0,
    numberOfNewLines: 0,
    numberOfDeletedLines: 0,
  };
}

function getShortstats(logs) {
  return logs
    .map((log) => parseShortstat(log.hash))
    .filter((log) => log !== null);
}

function sumShortstats(shortstats) {
  return shortstats.reduce((a, b) => {
    return {
      numberOfFiles: a.numberOfFiles + b.numberOfFiles,
      numberOfNewLines: a.numberOfNewLines + b.numberOfNewLines,
      numberOfDeletedLines: a.numberOfDeletedLines + b.numberOfDeletedLines,
    };
  });
}

function sumShortstatsFromLogs(logs) {
  const shortstats = getShortstats(logs);
  if (shortstats.length === 0) {
    return getEmptyShortstats();
  }

  return sumShortstats(shortstats);
}

function avgShortstatsFromLogs(logs) {
  const shortstats = getShortstats(logs);
  if (shortstats.length === 0) {
    return getEmptyShortstats();
  }
  const sum = sumShortstats(shortstats);
  const avg = (i) => (i > 0 ? Math.round(i / shortstats.length) : 0);
  return {
    numberOfFiles: avg(sum.numberOfFiles),
    numberOfNewLines: avg(sum.numberOfNewLines),
    numberOfDeletedLines: avg(sum.numberOfDeletedLines),
  };
}

function sorted(arr) {
  arr.sort((a, b) => a - b);
  return arr;
}

function medShortstatsFromLogs(logs) {
  const shortstats = getShortstats(logs);
  if (shortstats.length === 0) {
    return getEmptyShortstats();
  }

  const numberOfFiles = sorted(shortstats.map((s) => s.numberOfFiles));
  const numberOfNewLines = sorted(shortstats.map((s) => s.numberOfNewLines));
  const numberOfDeletedLines = sorted(
    shortstats.map((s) => s.numberOfDeletedLines)
  );

  const med = (arr) => {
    if (arr.length === 0) {
      return 0;
    }
    if (arr.length === 1) {
      return arr[0];
    }
    return arr[Math.round(arr.length / 2)];
  };

  return {
    numberOfFiles: med(numberOfFiles),
    numberOfNewLines: med(numberOfNewLines),
    numberOfDeletedLines: med(numberOfDeletedLines),
  };
}

// TODO: median

/* Given a array of logs, counts the number of unique issues */
function countNumberOfIssues(logs) {
  const issueKeys = logs
    .map((log) => parseIssueKey(log.message))
    .filter((issueKey) => issueKey !== null);

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
function toUserStats(shortstats, userLogs) {
  return {
    ...shortstats,
    numberOfIssues: countNumberOfIssues(userLogs),
    numberOfCommits: userLogs.length,
  };
}

function sumUserStats(userLogs) {
  const shortstats = sumShortstatsFromLogs(userLogs);
  return toUserStats(shortstats, userLogs);
}

function avgUserStats(userLogs) {
  const shortstats = avgShortstatsFromLogs(userLogs);
  return toUserStats(shortstats, userLogs);
}

function medUserStats(userLogs) {
  const shortstats = medShortstatsFromLogs(userLogs);
  return toUserStats(shortstats, userLogs);
}

module.exports = {
  parseShortstat,
  parseIssueKey,
  sumUserStats,
  avgUserStats,
  medUserStats,
};
