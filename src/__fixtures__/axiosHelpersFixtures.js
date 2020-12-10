const { testAccessToken } = require("./GoldifySolofixtures");

exports.basicHeaders = function () {
  return {
    headers: {
      Authorization: "Bearer " + testAccessToken,
    },
  };
};
