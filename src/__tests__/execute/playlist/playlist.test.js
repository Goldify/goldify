import "@testing-library/jest-dom";
import axios from "axios";
import {
  createPlaylistUrl,
  createGoldifyPlaylist,
  getUserPlaylistsUrl,
  findExistingGoldifyPlaylistByName,
  getPlaylistUrl,
  getPlaylistById,
} from "../../../js/utils/playlist";

jest.mock("axios");

const goldifyExecuteTestUtils = require("../../../__test_utils__/GoldifyExecuteTestUtils");
const playlistTestUtils = require("../../../__test_utils__/playlistTestUtils");

test("Confirm createPlaylistUrl returns the correct Spotify API URL including params", () => {
  const userId = "abc123";
  expect(createPlaylistUrl(userId)).toEqual(
    "https://api.spotify.com/v1/users/abc123/playlists"
  );
});

test("Confirm getUserPlaylistUrl returns the correct Spotify API URL", () => {
  expect(getUserPlaylistsUrl()).toEqual(
    "https://api.spotify.com/v1/me/playlists?limit=50"
  );
});

test("Confirm getPlaylistUrl returns the correct Spotify API URL including params", () => {
  const playlistId = "testPlaylistId123";
  expect(getPlaylistUrl(playlistId)).toEqual(
    "https://api.spotify.com/v1/playlists/testPlaylistId123"
  );
});

test("Creates a Goldify Playlist", async () => {
  const userId = "Abcd1234";
  const playlistName = "Goldify";
  const playlistDescription = "Goldify Goldify";

  const playlistResponseData = playlistTestUtils.createGoldifyPlaylist(
    userId,
    playlistName,
    playlistDescription
  );
  axios.post.mockResolvedValue({
    data: playlistResponseData,
  });

  const responseData = await createGoldifyPlaylist(
    goldifyExecuteTestUtils.getTokensTestData(),
    userId,
    playlistName,
    playlistDescription
  );
  expect(responseData).toEqual(playlistResponseData);
});

test("CreatePlaylist throws error on bad data", async () => {
  const userId = "Abcd1234";
  const playlistName = "Goldify";
  const playlistDescription = "Goldify Goldify";

  axios.post.mockResolvedValue(null);
  console.log = jest.fn();
  await createGoldifyPlaylist(
    goldifyExecuteTestUtils.getTokensTestData(),
    userId,
    playlistName,
    playlistDescription
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.post.mockResolvedValue(undefined);
  console.log = jest.fn();
  await createGoldifyPlaylist(
    goldifyExecuteTestUtils.getTokensTestData(),
    userId,
    playlistName,
    playlistDescription
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Gets a Playlist by ID", async () => {
  const playlistId = "Abcd1234";

  const playlistResponseData = playlistTestUtils.getPlaylistById(playlistId);
  axios.get.mockResolvedValue({
    data: playlistResponseData,
  });

  const responseData = await getPlaylistById(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId
  );
  expect(responseData).toEqual(playlistResponseData);
});

test("GetPlaylistById throws error on bad data", async () => {
  const playlistId = "Abcd1234";
  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await getPlaylistById(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await getPlaylistById(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Returns Goldify playlist when user has existing playlist", async () => {
  const playlistName = "Goldify";

  const userPlaylistsResponseData = playlistTestUtils.userHasExistingGoldifyPlaylist(
    playlistName
  );
  const existingPlaylistResponseData = playlistTestUtils.existingGoldifyPlaylist(
    playlistName
  );

  axios.get.mockResolvedValue({
    data: userPlaylistsResponseData,
  });

  const responseData = await findExistingGoldifyPlaylistByName(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistName
  );
  expect(responseData).toEqual(existingPlaylistResponseData);
});

test("Returns null when user doesn't have existing playlist", async () => {
  const playlistName = "Goldify";

  const userPlaylistsResponseData = playlistTestUtils.userDoesntHaveExistingGoldifyPlaylist();
  const existingPlaylistResponseData = null;

  axios.get.mockResolvedValue({
    data: userPlaylistsResponseData,
  });

  const responseData = await findExistingGoldifyPlaylistByName(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistName
  );
  expect(responseData).toEqual(existingPlaylistResponseData);
});

test("Returns null when user doesn't have any playlists", async () => {
  const playlistName = "Goldify";

  const userPlaylistsResponseData = playlistTestUtils.userDoesntHavePlaylists();
  const existingPlaylistResponseData = null;

  axios.get.mockResolvedValue({
    data: userPlaylistsResponseData,
  });

  const responseData = await findExistingGoldifyPlaylistByName(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistName
  );
  expect(responseData).toEqual(existingPlaylistResponseData);
});

test("findExistingGoldifyPlaylistByName throws error on bad data", async () => {
  const playlistName = "Goldify";
  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await findExistingGoldifyPlaylistByName(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistName
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await findExistingGoldifyPlaylistByName(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistName
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});
