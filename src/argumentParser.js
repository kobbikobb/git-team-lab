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

function dateOrToday(date, todaysDate) {
  return date ? new Date(date) : todaysDate;
}

function getDateInterval(arguments, todaysDate = new Date()) {
  const since = arguments[2];
  const until = toIso(todaysDate);
  const interval = arguments[3];

  const dateRanges = interval
    ? forDateRange(dateOrToday(since, todaysDate), todaysDate, interval)
    : forSingleDay(dateOrToday(since, todaysDate), todaysDate);

  return {
    since: since,
    until: until,
    intervals: toIntervals(dateRanges),
  };
}

module.exports = {
  getDateInterval,
};
