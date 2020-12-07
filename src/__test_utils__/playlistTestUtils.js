const testPlaylistId = "TEST_PLAYLIST_ID";
const testPlaylistName = "TEST_PLAYLIST_NAME";
const testPlaylistDescription = "TEST_PLAYLIST_DESCRIPTION";
const testNonGoldifyPlaylistId = "TEST_NON_GOLDIFY_PLAYLIST_ID";
const testNonGoldifyPlaylistName = "TEST_NON_GOLDIFY_PLAYLIST_NAME";
const testNonGoldifyPlaylistDescription =
  "TEST_NON_GOLDIFY_PLAYLIST_DESCRIPTION";
const testUserId = "TEST_USER_ID";
const testSnapshotId = "abcd12345";

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
        testPlaylistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href:
      "https://api.spotify.com/v1/users/" +
      userId +
      "/playlists/" +
      testPlaylistId,
    id: testPlaylistId,
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
    snapshot_id: testSnapshotId,
    tracks: {
      href:
        "https://api.spotify.com/v1/users/" +
        userId +
        "/playlists/" +
        testPlaylistId +
        "/tracks",
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: "playlist",
    uri: "spotify:user:" + userId + ":playlist:" + testPlaylistId,
  };
};

exports.getPlaylistById = function(playlistId) {
  return {
    collaborative: false,
    description: testPlaylistDescription,
    external_urls: {
      spotify:
        "http://open.spotify.com/user/" +
        testUserId +
        "/playlist/" +
        playlistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href:
      "https://api.spotify.com/v1/users/" +
      testUserId +
      "/playlists/" +
      playlistId,
    id: playlistId,
    images: [],
    name: testPlaylistName,
    owner: {
      external_urls: {
        spotify: "http://open.spotify.com/user/" + testUserId,
      },
      href: "https://api.spotify.com/v1/users/" + testUserId,
      id: testUserId,
      type: "user",
      uri: "spotify:user:" + testUserId,
    },
    public: false,
    snapshot_id: testSnapshotId,
    tracks: {
      href:
        "https://api.spotify.com/v1/users/" +
        testUserId +
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
    uri: "spotify:user:" + testUserId + ":playlist:" + playlistId,
  };
};

exports.userHasExistingGoldifyPlaylist = function(playlistName) {
  return {
    href: "https://api.spotify.com/v1/users/" + testUserId + "/playlists",
    items: [
      {
        collaborative: false,
        description: testNonGoldifyPlaylistDescription,
        external_urls: {
          spotify:
            "http://open.spotify.com/user/" +
            testUserId +
            "/playlist/" +
            testNonGoldifyPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          "https://api.spotify.com/v1/users/" +
          testUserId +
          "/playlists/" +
          testNonGoldifyPlaylistId,
        id: testNonGoldifyPlaylistId,
        images: [],
        name: testNonGoldifyPlaylistName,
        owner: {
          external_urls: {
            spotify: "http://open.spotify.com/user/" + testUserId,
          },
          href: "https://api.spotify.com/v1/users/" + testUserId,
          id: testUserId,
          type: "user",
          uri: "spotify:user:" + testUserId,
        },
        public: false,
        snapshot_id: testSnapshotId,
        tracks: {
          href:
            "https://api.spotify.com/v1/users/" +
            testUserId +
            "/playlists/" +
            testNonGoldifyPlaylistId +
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
          testUserId +
          ":playlist:" +
          testNonGoldifyPlaylistId,
      },
      {
        collaborative: false,
        description: testPlaylistDescription,
        external_urls: {
          spotify:
            "http://open.spotify.com/user/" +
            testUserId +
            "/playlist/" +
            testPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          "https://api.spotify.com/v1/users/" +
          testUserId +
          "/playlists/" +
          testPlaylistId,
        id: testPlaylistId,
        images: [],
        name: playlistName,
        owner: {
          external_urls: {
            spotify: "http://open.spotify.com/user/" + testUserId,
          },
          href: "https://api.spotify.com/v1/users/" + testUserId,
          id: testUserId,
          type: "user",
          uri: "spotify:user:" + testUserId,
        },
        public: false,
        snapshot_id: testSnapshotId,
        tracks: {
          href:
            "https://api.spotify.com/v1/users/" +
            testUserId +
            "/playlists/" +
            testPlaylistId +
            "/tracks",
          items: [],
          limit: 100,
          next: null,
          offset: 0,
          previous: null,
          total: 0,
        },
        type: "playlist",
        uri: "spotify:user:" + testUserId + ":playlist:" + testPlaylistId,
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
    description: testPlaylistDescription,
    external_urls: {
      spotify:
        "http://open.spotify.com/user/" +
        testUserId +
        "/playlist/" +
        testPlaylistId,
    },
    followers: {
      href: null,
      total: 0,
    },
    href:
      "https://api.spotify.com/v1/users/" +
      testUserId +
      "/playlists/" +
      testPlaylistId,
    id: testPlaylistId,
    images: [],
    name: playlistName,
    owner: {
      external_urls: {
        spotify: "http://open.spotify.com/user/" + testUserId,
      },
      href: "https://api.spotify.com/v1/users/" + testUserId,
      id: testUserId,
      type: "user",
      uri: "spotify:user:" + testUserId,
    },
    public: false,
    snapshot_id: testSnapshotId,
    tracks: {
      href:
        "https://api.spotify.com/v1/users/" +
        testUserId +
        "/playlists/" +
        testPlaylistId +
        "/tracks",
      items: [],
      limit: 100,
      next: null,
      offset: 0,
      previous: null,
      total: 0,
    },
    type: "playlist",
    uri: "spotify:user:" + testUserId + ":playlist:" + testPlaylistId,
  };
};

exports.userDoesntHaveExistingGoldifyPlaylist = function() {
  return {
    href: "https://api.spotify.com/v1/users/" + testUserId + "/playlists",
    items: [
      {
        collaborative: false,
        description: testNonGoldifyPlaylistDescription,
        external_urls: {
          spotify:
            "http://open.spotify.com/user/" +
            testUserId +
            "/playlist/" +
            testNonGoldifyPlaylistId,
        },
        followers: {
          href: null,
          total: 0,
        },
        href:
          "https://api.spotify.com/v1/users/" +
          testUserId +
          "/playlists/" +
          testNonGoldifyPlaylistId,
        id: testNonGoldifyPlaylistId,
        images: [],
        name: testNonGoldifyPlaylistName,
        owner: {
          external_urls: {
            spotify: "http://open.spotify.com/user/" + testUserId,
          },
          href: "https://api.spotify.com/v1/users/" + testUserId,
          id: testUserId,
          type: "user",
          uri: "spotify:user:" + testUserId,
        },
        public: false,
        snapshot_id: testSnapshotId,
        tracks: {
          href:
            "https://api.spotify.com/v1/users/" +
            testUserId +
            "/playlists/" +
            testNonGoldifyPlaylistId +
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
          testUserId +
          ":playlist:" +
          testNonGoldifyPlaylistId,
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
    href: "https://api.spotify.com/v1/users/" + testUserId + "/playlists",
    items: [],
    limit: 9,
    next: null,
    offset: 0,
    previous: null,
    total: 0,
  };
};
