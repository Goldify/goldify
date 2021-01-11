exports.testAlbumName = "TEST_ALBUM_NAME";
exports.testAlbumId = "TEST_ALBUM_ID";
exports.testArtistName1 = "TEST_ARTIST_NAME_1";
exports.testArtistId1 = "TEST_ARTIST1_ID";
exports.testArtistName2 = "TEST_ARTIST_NAME_2";
exports.testArtistId2 = "TEST_ARTIST2_ID";
exports.testTrackName = "TEST_SONG_NAME";
exports.testTrackId = "TEST_TRACK_ID";
exports.testPopularity = 47;
exports.testAlbumArtImageURL = "test-album-art.com";
exports.testUri = "TEST_URI";
exports.badUri = "BAD_URI";

exports.getTermTopListeningData = function () {
  return {
    items: [
      {
        album: {
          name: this.testAlbumName,
          images: [
            {
              url: this.testAlbumArtImageURL,
            },
          ],
          artists: [
            {
              id: this.testArtistId1,
              name: this.testArtistName1,
            },
            {
              id: this.testArtistId2,
              name: this.testArtistName2,
            },
          ],
          id: this.testAlbumId,
        },
        id: this.testTrackId,
        name: this.testTrackName,
        popularity: this.testPopularity,
        uri: this.testUri,
      },
      {
        album: {
          name: this.testAlbumName,
          images: [
            {
              url: this.testAlbumArtImageURL,
            },
          ],
          artists: [
            {
              id: this.testArtistId1,
              name: this.testArtistName1,
            },
            {
              id: this.testArtistId2,
              name: this.testArtistName2,
            },
          ],
          id: this.testAlbumId,
        },
        id: this.testTrackId,
        name: this.testTrackName,
        popularity: this.testPopularity,
        uri: this.badUri,
      },
    ],
  };
};

exports.getTopListeningData = function () {
  return {
    short_term: this.getTermTopListeningData(),
    medium_term: this.getTermTopListeningData(),
    long_term: this.getTermTopListeningData(),
  };
};
