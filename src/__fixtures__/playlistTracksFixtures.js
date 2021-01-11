exports.testUserId = "TEST_USER_ID";
exports.testAlbumArtImageURL = "test-album-art.com";
exports.testAlbumName = "TEST_ALBUM_NAME";
exports.testAlbumId = "TEST_ALBUM_ID";
exports.testArtistName1 = "TEST_ARTIST_NAME_1";
exports.testArtistId1 = "TEST_ARTIST_ID_1";
exports.testArtistName2 = "TEST_ARTIST_NAME_2";
exports.testArtistId2 = "TEST_ARTIST_ID_2";
exports.testTrackName1 = "TEST_SONG_NAME_1";
exports.testTrackId1 = "TEST_SONG_ID_1";
exports.testTrackName2 = "TEST_SONG_NAME_2";
exports.testTrackId2 = "TEST_SONG_ID_2";
exports.testTimeStamp = "2020-11-11T11:11:11Z";

exports.testTrack = function (trackName, trackId) {
  return {
    added_at: this.testTimeStamp,
    added_by: {
      href: "https://api.spotify.com/v1/users/" + this.testUserId,
      id: this.testUserId,
      type: "user",
      uri: "spotify:user:" + this.testUserId,
    },
    is_local: false,
    track: {
      album: {
        album_type: "single",
        artists: [
          {
            id: this.testArtistId1,
            name: this.testArtistName1,
            type: "artist",
            uri: "spotify:artist:" + this.testArtistId1,
          },
          {
            id: this.testArtistId2,
            name: this.testArtistName2,
            type: "artist",
            uri: "spotify:artist:" + this.testArtistId2,
          },
        ],
        available_markets: ["US"],
        href: "https://api.spotify.com/v1/albums/" + this.testAlbumId,
        id: this.testAlbumId,
        images: [
          {
            height: 640,
            url: this.testAlbumArtImageURL,
            width: 640,
          },
        ],
        name: this.testAlbumName,
        type: "album",
        uri: "spotify:album:" + this.testAlbumId,
      },
      artists: [
        {
          id: this.testArtistId1,
          name: this.testArtistName1,
          type: "artist",
          uri: "spotify:artist:" + this.testArtistId1,
        },
        {
          id: this.testArtistId2,
          name: this.testArtistName2,
          type: "artist",
          uri: "spotify:artist:" + this.testArtistId2,
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
      this.testUserId +
      "/playlists/" +
      playlistId +
      "/tracks",
    items: [
      this.testTrack(this.testTrackName1, this.testTrackId1),
      this.testTrack(this.testTrackName2, this.testTrackId2),
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
      this.testUserId +
      "/playlists/" +
      playlistId +
      "/tracks",
    items: [
      trackURIs.forEach((uri) => this.testTrack(this.testTrackName1, uri)),
    ],
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 58,
  };
};

exports.tracksWithURIs = function () {
  return [
    this.testTrack(this.testTrackName1, this.testTrackId1),
    this.testTrack(this.testTrackName2, this.testTrackId2),
  ];
};
exports.trackURIs = function () {
  return [
    "spotify:track:" + this.testTrackId1,
    "spotify:track:" + this.testTrackId2,
  ];
};
