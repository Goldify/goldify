exports.testAuthenticationCode = "TEST_AUTH_CODE";

exports.testRefreshToken = "TEST_REFRESH_TOKEN";
exports.testAccessToken = "TEST_ACCESS_TOKEN";

exports.getTokensTestData = function () {
  return {
    refresh_token: this.testRefreshToken,
    access_token: this.testAccessToken
  }
}