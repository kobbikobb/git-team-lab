var { expect } = require("chai");

const {
  parseShortstat,
  parseIssueKey,
  parseUserStats
} = require("../src/gitUtils");

function aLog(
  hash = "2 files changed, 9 insertions(+), 6 deletions(-)",
  date = "2019-06-30 23:57:58 +0000",
  message = "First commit"
) {
  return {
    hash,
    date,
    message
  };
}

describe("gitUtils", () => {
  describe("when parsing shortstat", () => {
    it("should read from matched string", () => {
      const hash =
        "22 files changed, 93 insertions(+), 62 deletions(-)ANYTHING";

      const result = parseShortstat(hash);

      expect(result).to.deep.equal({
        numberOfFiles: 22,
        numberOfNewLines: 93,
        numberOfDeletedLines: 62
      });
    });
    it("should return null if not matched", () => {
      const hash = "22 files changed, 93 insertions(+)";
      const result = parseShortstat(hash);
      expect(result).to.equal(null);
    });
    it("should return null if argument null", () => {
      const hash = null;
      const result = parseShortstat(hash);
      expect(result).to.equal(null);
    });
  });

  describe("when parsing issue key from message", () => {
    it("should read jira issue key", () => {
      const message = "ABC-123 Commit message";
      const result = parseIssueKey(message);
      expect(result).to.equal("ABC-123");
    });
    it("should read git issue key", () => {
      const message = "123 Commit message";
      const result = parseIssueKey(message);
      expect(result).to.equal("123");
    });
    it("should not match string", () => {
      const message = "STRING";
      const result = parseIssueKey(message);
      expect(result).to.equal(null);
    });
    it("should not match issue key if not at the start", () => {
      const message = "Here is a commit for issue ABC-123";
      const result = parseIssueKey(message);
      expect(result).to.equal(null);
    });
    it("should parse null to null", () => {
      const message = null;
      const result = parseIssueKey(message);
      expect(result).to.equal(null);
    });
  });

  describe("when logs are parsed", () => {
    it("should count multiple logs", () => {
      const logs = {
        all: [aLog(), aLog(), aLog()]
      };

      const result = parseUserStats(logs);

      expect(result.numberOfCommits).to.equal(3);
    });

    it("should sum shortstat", () => {
      const logs = {
        all: [
          aLog(
            "2 files changed, 9 insertions(+), 6 deletions(-)\n\n38acece884941597ffcb56640af4a390e6034d52"
          ),
          aLog(
            "7 files changed, 1 insertions(+), 5 deletions(-)\n\n38acece884941597ffcb56640af4a390e6034d52"
          )
        ]
      };

      const result = parseUserStats(logs);

      expect(result.numberOfFiles).to.equal(9);
      expect(result.numberOfNewLines).to.equal(10);
      expect(result.numberOfDeletedLines).to.equal(11);
    });

    it("should sum shortstat even if not all have valid hash", () => {
      const logs = {
        all: [
          aLog(
            "2 files changed, 9 insertions(+), 6 deletions(-)\n\n38acece884941597ffcb56640af4a390e6034d52"
          ),
          aLog("Invalid hash")
        ]
      };

      const result = parseUserStats(logs);

      expect(result.numberOfFiles).to.equal(2);
      expect(result.numberOfNewLines).to.equal(9);
      expect(result.numberOfDeletedLines).to.equal(6);
    });

    it("should return 0 shortstat if nothing valid", () => {
      const logs = {
        all: [aLog("Invalid hash")]
      };

      const result = parseUserStats(logs);

      expect(result.numberOfFiles).to.equal(0);
      expect(result.numberOfNewLines).to.equal(0);
      expect(result.numberOfDeletedLines).to.equal(0);
    });

    it("should count number of unique issues", () => {
      const logs = {
        all: [
          aLog(null, null, "TUI-123 Bankok"),
          aLog(null, null, "TUI-123 Bankok"),
          aLog(null, null, "1234 Bankok"),
          aLog(null, null, "Nothing at all")
        ]
      };

      const result = parseUserStats(logs);

      expect(result.numberOfIssues).to.equal(2);
    });
  });
});
