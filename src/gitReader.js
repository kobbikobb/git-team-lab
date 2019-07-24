const git = require("simple-git");

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
  withShortstatShiftedUp,
  getUserLog
};
