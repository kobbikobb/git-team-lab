function toIso(date) {
  return date.toISOString().substring(0, 10);
}

function addDay(date) {
  return new Date(new Date(date).setDate(date.getDate() + 1));
}

function addWeek(date) {
  return new Date(new Date(date).setDate(date.getDate() + 7));
}

function addMonth(date) {
  return new Date(new Date(date).setMonth(date.getMonth() + 1));
}

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

function getDateRanges(fromDate, toDate, interval) {
  const dateRanges = [];

  let targetDate = new Date(fromDate);

  while (targetDate < toDate) {
    const rangeToDate = addInterval(targetDate, interval);
    dateRanges.push({
      fromDate: toIso(targetDate),
      toDate: toIso(rangeToDate)
    });
    targetDate = rangeToDate;
  }

  return dateRanges;
}

module.exports = {
  getDateRanges
};
