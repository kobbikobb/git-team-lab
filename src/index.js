const { getUserLog } = require("./gitUtils");

const path = "/Users/jakobjonasson/Code/git-team-queries/.git";

getUserLog({
  path,
  author: "jakobjo",
  since: "2019-06-17"
}).then(result => {
  console.log(result);
});
