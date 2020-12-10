const testUserId = "TEST_USER_ID";
const testAlbumArtImageURL = "test-album-art.com";
const testAlbumName = "TEST_ALBUM_NAME";
const testAlbumId = "TEST_ALBUM_ID";
const testArtistName1 = "TEST_ARTIST_NAME_1";
const testArtistId1 = "TEST_ARTIST_ID_1";
const testArtistName2 = "TEST_ARTIST_NAME_2";
const testArtistId2 = "TEST_ARTIST_ID_2";
const testTrackName1 = "TEST_SONG_NAME_1";
const testTrackId1 = "TEST_SONG_ID_1";
const testTrackName2 = "TEST_SONG_NAME_2";
const testTrackId2 = "TEST_SONG_ID_2";
const testTimeStamp = "2020-11-11T11:11:11Z";

exports.testTrack = function (trackName, trackId) {
  return {
    added_at: testTimeStamp,
    added_by: {
      href: "https://api.spotify.com/v1/users/" + testUserId,
      id: testUserId,
      type: "user",
      uri: "spotify:user:" + testUserId,
    },
    is_local: false,
    track: {
      album: {
        album_type: "single",
        artists: [
          {
            id: testArtistId1,
            name: testArtistName1,
            type: "artist",
            uri: "spotify:artist:" + testArtistId1,
          },
          {
            id: testArtistId2,
            name: testArtistName2,
            type: "artist",
            uri: "spotify:artist:" + testArtistId2,
          },
        ],
        available_markets: ["US"],
        href: "https://api.spotify.com/v1/albums/" + testAlbumId,
        id: testAlbumId,
        images: [
          {
            height: 640,
            url: testAlbumArtImageURL,
            width: 640,
          },
        ],
        name: testAlbumName,
        type: "album",
        uri: "spotify:album:" + testAlbumId,
      },
      artists: [
        {
          id: testArtistId1,
          name: testArtistName1,
          type: "artist",
          uri: "spotify:artist:" + testArtistId1,
        },
        {
          id: testArtistId2,
          name: testArtistName2,
          type: "artist",
          uri: "spotify:artist:" + testArtistId2,
        },
      ],
      available_markets: [],
      disc_number: 1,
      duration_ms: 123456,
      explicit: false,
      href: "https://api.spotify.com/v1/tracks/" + trackId,
      id: trackId,
      name: trackName,
      popularity: 85,
      track_number: 1,
      type: "track",
      uri: "spotify:track:" + trackId,
    },
  };
};

exports.playlistTracksById = function (playlistId) {
  return {
    href:
      "https://api.spotify.com/v1/users/" +
      testUserId +
      "/playlists/" +
      playlistId +
      "/tracks",
    items: [
      this.testTrack(testTrackName1, testTrackId1),
      this.testTrack(testTrackName2, testTrackId2),
    ],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 58,
  };
};

exports.replacePlaylistTracksByIdAndURIs = function (playlistId, trackURIs) {
  return {
    href:
      "https://api.spotify.com/v1/users/" +
      testUserId +
      "/playlists/" +
      playlistId +
      "/tracks",
    items: [trackURIs.forEach((uri) => this.testTrack(testTrackName1, uri))],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 58,
  };
};

exports.tracksWithURIs = function () {
  return [
    this.testTrack(testTrackName1, testTrackId1),
    this.testTrack(testTrackName2, testTrackId2),
  ];
};
exports.trackURIs = function () {
  return ["spotify:track:" + testTrackId1, "spotify:track:" + testTrackId2];
};
