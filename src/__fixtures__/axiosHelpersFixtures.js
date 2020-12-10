const { testAccessToken } = require("./GoldifySoloFixtures");

exports.basicHeaders = function () {
  return {
    headers: {
      Authorization: "Bearer " + testAccessToken,
    },
  };
};
