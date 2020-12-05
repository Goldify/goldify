exports.testAlbumName = "TEST_ALBUM_NAME";
exports.testArtistName1 = "TEST_ARTIST_NAME_1";
exports.testArtistName2 = "TEST_ARTIST_NAME_2";
exports.testSongName = "TEST_SONG_NAME";
exports.testPopularity = 47;
exports.testAlbumArtImageURL = "test-album-art.com"

exports.getTopListeningData = function () {
  return {
    items: [
      {
        album: {
          name: this.testAlbumName,
          images: [
            {
              url: this.testAlbumArtImageURL
            }
          ],
          artists: [
            {
              name: this.testArtistName1
            },
            {
              name: this.testArtistName2
            }
          ]
        },
        name: this.testSongName,
        popularity: this.testPopularity
      }
    ]
  }
}