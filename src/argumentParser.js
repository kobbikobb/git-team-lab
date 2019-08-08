const { forSingleDay, forDateRange } = require("./gitDateRange");

function getDateRanges(arguments, todaysDate = new Date()) {
  const since = arguments[2];
  const interval = arguments[3];

  if (!interval) {
    return forSingleDay(since ? new Date(since) : todaysDate, todaysDate);
  }

  return forDateRange(new Date(since), todaysDate, interval);
}

module.exports = {
  getDateRanges
};
