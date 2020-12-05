exports.testPlaylistId = "TEST_PLAYLIST_ID";
exports.testPlaylistName = "TEST_PLAYLIST_NAME";
exports.testUserId = "TEST_USER_ID";
exports.testAlbumArtImageURL = "test-album-art.com";
exports.testAlbumName = "TEST_ALBUM_NAME";
exports.testAlbumId = "TEST_ALBUM_ID";
exports.testArtistName = "TEST_ARTIST_NAME";
exports.testArtistId = "TEST_ARTIST_ID";
exports.testTrackName1 = "TEST_SONG_NAME_1";
exports.testTrackId1 = "TEST_SONG_ID_1";
exports.testTrackName2 = "TEST_SONG_NAME_2";
exports.testTrackId2 = "TEST_SONG_ID_2";
exports.testAlbumArtImageURL = "test-album-art.com";
exports.testTimeStamp = "2020-11-11T11:11:11Z";

exports.testTrack = function(trackName, trackId) {
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
            id: this.testArtistId,
            name: this.testArtistName,
            type: "artist",
            uri: "spotify:artist:" + this.testArtistId,
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
          href: "https://api.spotify.com/v1/artists/" + this.testArtistId,
          id: this.testArtistId,
          name: this.testArtistName,
          type: "artist",
          uri: "spotify:artist:" + this.testArtistId,
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

exports.playlistTracksById = function(playlistId) {
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

exports.replacePlaylistTracksByIdAndURIs = function(playlistId, trackURIs) {
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

exports.tracksWithURIs = function() {
  return [
    this.testTrack(this.testTrackName1, this.testTrackId1),
    this.testTrack(this.testTrackName2, this.testTrackId2),
  ];
};
exports.trackURIs = function() {
  return [
    "spotify:track:" + this.testTrackId1,
    "spotify:track:" + this.testTrackId2,
  ];
};
