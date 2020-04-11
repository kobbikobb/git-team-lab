var { expect } = require("chai");

const ArgumentsWrapper = require("../src/ArgumentsWrapper");

describe("ArgumentsWrapper", () => {
  it("should get named argument date", () => {
    const wrapper = new ArgumentsWrapper(["node", "path", "since=2018-12-30"]);

    const result = wrapper.getNamedArguments();

    expect(result).to.be.deep.equals({
      since: "2018-12-30",
    });
  });

  it("should get any named argument", () => {
    const wrapper = new ArgumentsWrapper(["one=1", "two=2"]);

    const result = wrapper.getNamedArguments();

    expect(result).to.be.deep.equals({
      one: "1",
      two: "2",
    });
  });
});
