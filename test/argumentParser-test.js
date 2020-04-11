var { expect } = require("chai");

const { getDateInterval } = require("../src/argumentParser");

const TODAY = new Date("2019-01-01");
const TOMORROW = new Date("2019-01-02");

function toIso(date) {
  return date.toISOString().substring(0, 10);
}

function expectHasIntervalDates(result, expected) {
  expect(
    result.intervals.map((i) => {
      return { since: i.since, until: i.until };
    })
  ).to.be.deep.equal(expected);
}

describe("argumentParser", () => {
  describe("when parsing no arguments", () => {
    it("should return since today", () => {
      const result = getDateInterval({ todaysDate: TODAY });

      expect(result.intervals.length).to.be.equal(1);
      expect(result.intervals[0].since).to.be.equal(toIso(TODAY));
      expect(result.intervals[0].until).to.be.equal(toIso(TOMORROW));
    });
  });

  describe("when parsing single date argument", () => {
    it("should return since that day", () => {
      const since = "2008-01-01";

      const result = getDateInterval({ since, todaysDate: TODAY });

      expect(result.intervals.length).to.be.equal(1);
      expect(result.intervals[0].since).to.be.equal(since);
      expect(result.intervals[0].until).to.be.equal(toIso(TOMORROW));
    });
  });

  describe("when parsing date with daily internval", () => {
    it("should return days since that day", () => {
      const since = "2018-12-28";

      const result = getDateInterval({
        since,
        interval: "day",
        todaysDate: TODAY,
      });

      const expected = [
        { since: "2018-12-28", until: "2018-12-29" },
        { since: "2018-12-29", until: "2018-12-30" },
        { since: "2018-12-30", until: "2018-12-31" },
        { since: "2018-12-31", until: "2019-01-01" },
        { since: "2019-01-01", until: "2019-01-02" },
      ];
      expectHasIntervalDates(result, expected);
    });
  });

  describe("when parsing date with weekly internval", () => {
    it("should return weeks since that day", () => {
      const since = "2018-12-15";

      const result = getDateInterval({
        since,
        interval: "week",
        todaysDate: TODAY,
      });

      const expected = [
        { since: "2018-12-15", until: "2018-12-22" },
        { since: "2018-12-22", until: "2018-12-29" },
        { since: "2018-12-29", until: "2019-01-05" },
      ];
      expectHasIntervalDates(result, expected);
    });
  });

  describe("when parsing date with monthly internval", () => {
    it("should return months since that day", () => {
      const since = "2018-10-15";

      const result = getDateInterval({
        since,
        interval: "month",
        todaysDate: TODAY,
      });

      const expected = [
        { since: "2018-10-15", until: "2018-11-15" },
        { since: "2018-11-15", until: "2018-12-15" },
        { since: "2018-12-15", until: "2019-01-15" },
      ];
      expectHasIntervalDates(result, expected);
    });
  });

  describe("when parsing date with yearly internval", () => {
    it("should return years since that day", () => {
      const since = "2018-02-15";

      const result = getDateInterval({
        since,
        interval: "year",
        todaysDate: TODAY,
      });

      const expected = [{ since: "2018-02-15", until: "2019-02-15" }];
      expectHasIntervalDates(result, expected);
    });
  });
});
