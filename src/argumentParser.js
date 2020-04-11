const { forDateRange } = require("./gitDateRange");

function toIso(date) {
  return date.toISOString().substring(0, 10);
}

function getNextDay(targetDate) {
  return new Date(new Date(targetDate).setDate(targetDate.getDate() + 1));
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

function toDateOrDefault(date, todaysDate) {
  return date ? new Date(date) : todaysDate;
}

function getDateInterval({ since, until, interval, todaysDate = new Date() }) {
  const tomorrowsDate = getNextDay(todaysDate);

  const dateFrom = toDateOrDefault(since, todaysDate);
  const dateTo = toDateOrDefault(until, tomorrowsDate);

  const dateRanges = forDateRange(dateFrom, dateTo, interval);

  return {
    since: since,
    until: until || toIso(tomorrowsDate),
    intervals: toIntervals(dateRanges),
  };
}

module.exports = {
  getDateInterval,
};
