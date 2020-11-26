exports.testUserId = "TEST_ID";
exports.testUserDisplayName = "Test User";
exports.testUserEmail = "test@email.com";
exports.testUserImageURL = "test_image.com";
exports.testUserFollowersTotal = 47;
exports.testUserExternalUrlSpotify = "test_spotify.com";
exports.testUserCountry = "Codeland";

exports.getUserTestData = function () {
  return {
    id: this.testUserId,
    display_name: this.testUserDisplayName,
    email: this.testUserEmail,
    images: [
      {
        url: this.testUserImageURL
      }
    ],
    followers: {
      total: this.testUserFollowersTotal
    },
    external_urls: {
      spotify: this.testUserExternalUrlSpotify
    },
    country: this.testUserCountry
  }
}