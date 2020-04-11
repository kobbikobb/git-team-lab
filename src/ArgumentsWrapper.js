const argumentParser = require("./argumentParser");

function toNamedArguments(argumentItems) {
  const namedArguments = {};

  for (let i = 0; i < argumentItems.length; i++) {
    const argumentItem = argumentItems[i];

    const index = argumentItem.indexOf("=");
    if (index > 0) {
      const key = argumentItem.substring(0, index);
      const value = argumentItem.substring(index + 1);
      namedArguments[key] = value;
    }
  }

  return namedArguments;
}

/**
 * since: yyyy-MM-dd - defaults to today
 * until: yyyy-MM-dd - defaults to tomorrow
 * interval: month, week, day - defaults to day
 * type: simple, list: default is simple
 */
class ArgumentsWrapper {
  constructor(argumentItems) {
    this.namedArguments = toNamedArguments(argumentItems);
  }
  getNamedArguments() {
    return this.namedArguments;
  }
  isListReport() {
    return (this.namedArguments["type"] === "list");
  }
  getDateInterval() {
    return argumentParser.getDateInterval(this.namedArguments);
  }
}

module.exports = ArgumentsWrapper;
