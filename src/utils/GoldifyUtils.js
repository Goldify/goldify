exports.jestTestIsRunning = function () {
  return process.env.JEST_WORKER_ID !== undefined;
}