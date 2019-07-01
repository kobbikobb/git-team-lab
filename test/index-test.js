var { expect } = require("chai");

const { parseUserStats, getUserLog } = require("../src/gitUtils");

describe("gitUtils", () => {
  describe("when a user has log", () => {
    it("should parse stats from it", () => {
      const result = parseUserStats();

      expect(result).to.equal(null);
    });
  });
});
