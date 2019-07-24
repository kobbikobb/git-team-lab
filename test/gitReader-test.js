var { expect } = require("chai");
var { aLog } = require("./testUtils");

const { withShortstatShiftedUp } = require("../src/gitReader");

describe("gitReader", () => {
  describe("When shifting logs", () => {
    it("should fix a bug where shortstat is shifted by shifting back", () => {
      const logs = {
        all: [
          aLog("45aa8054ca2630324a6ec00f5b0e47c3a8d5c3e6"),
          aLog(
            "1 file changed, 2 deletions(-)\n\nf3cbe7c0d713120ec054eb2744957138874330d6"
          ),
          aLog("1 file changed, 16 insertions(+), 14 deletions(-)", "", "")
        ],
        total: 3
      };

      const result = withShortstatShiftedUp(logs);

      expect(result.all.length).to.equal(2);
      expect(result.total).to.equal(2);
      expect(result.all[0].hash).to.equal(
        "1 file changed, 2 deletions(-)\n\n45aa8054ca2630324a6ec00f5b0e47c3a8d5c3e6"
      );
      expect(result.all[1].hash).to.equal(
        "1 file changed, 16 insertions(+), 14 deletions(-)\n\nf3cbe7c0d713120ec054eb2744957138874330d6"
      );
    });
  });
});
