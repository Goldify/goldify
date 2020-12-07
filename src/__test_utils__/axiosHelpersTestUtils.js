const { testAccessToken } = require("./GoldifyExecuteTestUtils");

exports.basicHeaders = function() {
  return {
    headers: {
      Authorization: "Bearer " + testAccessToken,
    },
  };
};
