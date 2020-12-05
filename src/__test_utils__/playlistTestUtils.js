exports.testPlaylistId = "TEST_PLAYLIST_ID";
exports.testPlaylistName = "TEST_PLAYLIST_NAME";
exports.testPlaylistDescription = "TEST_PLAYLIST_DESCRIPTION";
exports.testNonGoldifyPlaylistId = "TEST_NON_GOLDIFY_PLAYLIST_ID";
exports.testNonGoldifyPlaylistName = "TEST_NON_GOLDIFY_PLAYLIST_NAME";
exports.testNonGoldifyPlaylistDescription =
  "TEST_NON_GOLDIFY_PLAYLIST_DESCRIPTION";
exports.testUserId = "TEST_USER_ID";
exports.testAlbumArtImageURL = "test-album-art.com";
exports.testSnapshotId = "abcd12345";

exports.createGoldifyPlaylist = function(
  userId,
  playlistName,
  playlistDescription
) {
  return {
    collaborative: false,
    description: playlistDescription,
    external_urls: {
      spotify:
        "http://open.spotify.com/user/" +
        userId +
        "/playlist/" +
        this.testPlaylistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href:
      "https://api.spotify.com/v1/users/" +
      userId +
      "/playlists/" +
      this.testPlaylistId,
    id: this.testPlaylistId,
    images: [],
    name: playlistName,
    owner: {
      external_urls: {
        spotify: "http://open.spotify.com/user/" + userId,
      },
      href: "https://api.spotify.com/v1/users/" + userId,
      id: userId,
      type: "user",
      uri: "spotify:user:" + userId,
    },
    public: false,
    snapshot_id: this.testSnapshotId,
    tracks: {
      href:
        "https://api.spotify.com/v1/users/" +
        userId +
        "/playlists/" +
        this.testPlaylistId +
        "/tracks",
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: "playlist",
    uri: "spotify:user:" + userId + ":playlist:" + this.testPlaylistId,
  };
};

exports.getPlaylistById = function(playlistId) {
  return {
    collaborative: false,
    description: this.testPlaylistDescription,
    external_urls: {
      spotify:
        "http://open.spotify.com/user/" +
        this.testUserId +
        "/playlist/" +
        playlistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href:
      "https://api.spotify.com/v1/users/" +
      this.testUserId +
      "/playlists/" +
      playlistId,
    id: playlistId,
    images: [],
    name: this.testPlaylistName,
    owner: {
      external_urls: {
        spotify: "http://open.spotify.com/user/" + this.testUserId,
      },
      href: "https://api.spotify.com/v1/users/" + this.testUserId,
      id: this.testUserId,
      type: "user",
      uri: "spotify:user:" + this.testUserId,
    },
    public: false,
    snapshot_id: this.testSnapshotId,
    tracks: {
      href:
        "https://api.spotify.com/v1/users/" +
        this.testUserId +
        "/playlists/" +
        playlistId +
        "/tracks",
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: "playlist",
    uri: "spotify:user:" + this.testUserId + ":playlist:" + playlistId,
  };
};

exports.userHasExistingGoldifyPlaylist = function(playlistName) {
  return {
    href: "https://api.spotify.com/v1/users/" + this.testUserId + "/playlists",
    items: [
      {
        collaborative: false,
        description: "Non Goldify Playlist",
        external_urls: {
          spotify:
            "http://open.spotify.com/user/" +
            this.testUserId +
            "/playlist/" +
            this.testNonGoldifyPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          "https://api.spotify.com/v1/users/" +
          this.testUserId +
          "/playlists/" +
          this.testNonGoldifyPlaylistId,
        id: this.testNonGoldifyPlaylistId,
        images: [],
        name: "Non Goldify Playlist",
        owner: {
          external_urls: {
            spotify: "http://open.spotify.com/user/" + this.testUserId,
          },
          href: "https://api.spotify.com/v1/users/" + this.testUserId,
          id: this.testUserId,
          type: "user",
          uri: "spotify:user:" + this.testUserId,
        },
        public: false,
        snapshot_id: this.testSnapshotId,
        tracks: {
          href:
            "https://api.spotify.com/v1/users/" +
            this.testUserId +
            "/playlists/" +
            this.testNonGoldifyPlaylistId +
            "/tracks",
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: "playlist",
        uri:
          "spotify:user:" +
          this.testUserId +
          ":playlist:" +
          this.testNonGoldifyPlaylistId,
      },
      {
        collaborative: false,
        description: this.testPlaylistDescription,
        external_urls: {
          spotify:
            "http://open.spotify.com/user/" +
            this.testUserId +
            "/playlist/" +
            this.testPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          "https://api.spotify.com/v1/users/" +
          this.testUserId +
          "/playlists/" +
          this.testPlaylistId,
        id: this.testPlaylistId,
        images: [],
        name: playlistName,
        owner: {
          external_urls: {
            spotify: "http://open.spotify.com/user/" + this.testUserId,
          },
          href: "https://api.spotify.com/v1/users/" + this.testUserId,
          id: this.testUserId,
          type: "user",
          uri: "spotify:user:" + this.testUserId,
        },
        public: false,
        snapshot_id: this.testSnapshotId,
        tracks: {
          href:
            "https://api.spotify.com/v1/users/" +
            this.testUserId +
            "/playlists/" +
            this.testPlaylistId +
            "/tracks",
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: "playlist",
        uri:
          "spotify:user:" +
          this.testUserId +
          ":playlist:" +
          this.testPlaylistId,
      },
    ],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 2,
  };
};

// Matches goldify playlist in userHasExistingGoldifyPlaylist
exports.existingGoldifyPlaylist = function(playlistName) {
  return {
    collaborative: false,
    description: this.testPlaylistDescription,
    external_urls: {
      spotify:
        "http://open.spotify.com/user/" +
        this.testUserId +
        "/playlist/" +
        this.testPlaylistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href:
      "https://api.spotify.com/v1/users/" +
      this.testUserId +
      "/playlists/" +
      this.testPlaylistId,
    id: this.testPlaylistId,
    images: [],
    name: playlistName,
    owner: {
      external_urls: {
        spotify: "http://open.spotify.com/user/" + this.testUserId,
      },
      href: "https://api.spotify.com/v1/users/" + this.testUserId,
      id: this.testUserId,
      type: "user",
      uri: "spotify:user:" + this.testUserId,
    },
    public: false,
    snapshot_id: this.testSnapshotId,
    tracks: {
      href:
        "https://api.spotify.com/v1/users/" +
        this.testUserId +
        "/playlists/" +
        this.testPlaylistId +
        "/tracks",
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: "playlist",
    uri: "spotify:user:" + this.testUserId + ":playlist:" + this.testPlaylistId,
  };
};

exports.userDoesntHaveExistingGoldifyPlaylist = function() {
  return {
    href: "https://api.spotify.com/v1/users/" + this.testUserId + "/playlists",
    items: [
      {
        collaborative: false,
        description: "Non Goldify Playlist",
        external_urls: {
          spotify:
            "http://open.spotify.com/user/" +
            this.testUserId +
            "/playlist/" +
            this.testNonGoldifyPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          "https://api.spotify.com/v1/users/" +
          this.testUserId +
          "/playlists/" +
          this.testNonGoldifyPlaylistId,
        id: this.testNonGoldifyPlaylistId,
        images: [],
        name: "Non Goldify Playlist",
        owner: {
          external_urls: {
            spotify: "http://open.spotify.com/user/" + this.testUserId,
          },
          href: "https://api.spotify.com/v1/users/" + this.testUserId,
          id: this.testUserId,
          type: "user",
          uri: "spotify:user:" + this.testUserId,
        },
        public: false,
        snapshot_id: this.testSnapshotId,
        tracks: {
          href:
            "https://api.spotify.com/v1/users/" +
            this.testUserId +
            "/playlists/" +
            this.testNonGoldifyPlaylistId +
            "/tracks",
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: "playlist",
        uri:
          "spotify:user:" +
          this.testUserId +
          ":playlist:" +
          this.testNonGoldifyPlaylistId,
      },
    ],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 1,
  };
};

exports.userDoesntHavePlaylists = function() {
  return {
    href: "https://api.spotify.com/v1/users/" + this.testUserId + "/playlists",
    items: [],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 0,
  };
};
