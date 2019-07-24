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

module.exports = {
  aLog
};
