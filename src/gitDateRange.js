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

function addYear(date) {
  const nextYear = new Date(date);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return nextYear;
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
  if (interval === "year") {
    return addYear(date);
  }
  throw new Error(`Interval ${interval} not supported`);
}

function forSingleDay(targetDate, todaysDate = new Date()) {
  return [
    {
      since: toIso(targetDate),
      until: toIso(addInterval(todaysDate, "day"))
    }
  ];
}

function forDateRange(dateFrom, dateTo, interval) {
  const dateRanges = [];

  let targetDate = dateFrom;

  while (targetDate < dateTo) {
    const dateUntil = addInterval(targetDate, interval);
    dateRanges.push({
      since: toIso(targetDate),
      until: toIso(dateUntil)
    });
    targetDate = dateUntil;
  }

  return dateRanges;
}

module.exports = {
  forSingleDay,
  forDateRange
};
