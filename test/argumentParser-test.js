var { expect } = require("chai");

const { getDateRanges } = require("../src/argumentParser");

const TODAY = new Date("2019-01-01");

function todayAsIso() {
  return TODAY.toISOString().substring(0, 10);
}

describe("argumentParser", () => {
  describe("when parsing no arguments", () => {
    it("should return since today", () => {
      const arguments = ["", ""];

      const result = getDateRanges(arguments, TODAY);

      expect(result.length).to.be.equal(1);
      expect(result[0].since).to.be.equal(todayAsIso());
      expect(result[0].until).to.be.null;
    });
  });

  describe("when parsing single date argument", () => {
    it("should return since that day", () => {
      const since = "2008-01-01";
      const arguments = ["", "", since];

      const result = getDateRanges(arguments, TODAY);

      expect(result.length).to.be.equal(1);
      expect(result[0].since).to.be.equal(since);
      expect(result[0].until).to.be.null;
    });
  });

  describe("when parsing date with weekly internval", () => {
    it("should return since that day", () => {
      const since = "2018-12-15";
      const arguments = ["", "", since, "week"];

      const result = getDateRanges(arguments, TODAY);

      const expected = [
        { since: "2018-12-15", until: "2018-12-22" },
        { since: "2018-12-22", until: "2018-12-29" },
        { since: "2018-12-29", until: "2019-01-05" }
      ];
      expect(result.length).to.be.equal(3);
      expect(result).to.be.deep.equal(expected);
    });
  });

  describe("when parsing date with monthly internval", () => {
    it("should return since that day", () => {
      const since = "2018-10-15";
      const arguments = ["", "", since, "month"];

      const result = getDateRanges(arguments, TODAY);

      const expected = [
        { since: "2018-10-15", until: "2018-11-15" },
        { since: "2018-11-15", until: "2018-12-15" },
        { since: "2018-12-15", until: "2019-01-15" }
      ];
      expect(result.length).to.be.equal(3);
      expect(result).to.be.deep.equal(expected);
    });
  });
});
