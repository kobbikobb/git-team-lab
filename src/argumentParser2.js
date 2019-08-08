const { forSingleDay, forDateRange } = require("./gitDateRange");

function toIso(date) {
  return date.toISOString().substring(0, 10);
}

function getDateInterval(arguments, todaysDate = new Date()) {
  const since = arguments[2];
  const until = toIso(todaysDate);
  const interval = arguments[3];

  const dateRanges = interval
    ? forDateRange(new Date(since), todaysDate, interval)
    : forSingleDay(since ? new Date(since) : todaysDate);

  const intervals = dateRanges.map(dateRange => {
    return {
      since: dateRange.since,
      until: dateRange.until,
      key: `${dateRange.since} to ${dateRange.until}`,
      contains: date => {
        const dateDay = new Date(date);
        const dateSince = new Date(since);
        const dateUntil = new Date(until);
        return dateDay >= dateSince && dateDay <= dateUntil;
      }
    };
  });

  return {
    since: since,
    until: until,
    intervals: intervals
  };
}

module.exports = {
  getDateInterval
};
