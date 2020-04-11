const { forSingleDay, forDateRange } = require("./gitDateRange");

function toIso(date) {
  return date.toISOString().substring(0, 10);
}

function toIntervals(dateRanges) {
  return dateRanges.map((dateRange) => {
    const { since, until } = dateRange;
    return {
      since: since,
      until: until,
      key: `${since} to ${until}`,
      contains: (date) => {
        const dateDay = new Date(date);
        const dateSince = new Date(since);
        const dateUntil = new Date(until);
        return dateDay >= dateSince && dateDay <= dateUntil;
      },
    };
  });
}

function getDateInterval(arguments, todaysDate = new Date()) {
  const since = arguments[2];
  const until = toIso(todaysDate);
  const interval = arguments[3];

  const dateRanges =
    interval && interval !== "none"
      ? forDateRange(new Date(since), todaysDate, interval)
      : forSingleDay(since ? new Date(since) : todaysDate);

  return {
    since: since,
    until: until,
    intervals: toIntervals(dateRanges),
  };
}

module.exports = {
  getDateInterval,
};
