const dateUtils = require("./dateUtils");

function addInterval(date, interval) {
  if (interval === "day") {
    return addDay(date);
  }
  if (interval === "week") {
    return addWeek(date);
  }
  if (interval === "month") {
    return addMonth(date);
  }
  throw new Error(`Interval ${interval} not supported`);
}

function getDateRanges(arguments, todaysDate = new Date()) {
  const since = arguments[2];
  const interval = arguments[3];

  if (!interval) {
    return [
      {
        since: since || toIso(todaysDate),
        until: null
      }
    ];
  }

  return dateUtils.getDateRanges(since, todaysDate, interval).map(date => {
    since: date.fromDate;
    until: date.toDate;
  });
}

module.exports = {
  getDateRanges
};
