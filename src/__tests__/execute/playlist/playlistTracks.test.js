import "@testing-library/jest-dom";
import axios from "axios";
import {
  playlistTracksUrl,
  getPlaylistTracksById,
  replacePlaylistTracks,
  getURIsFromList,
} from "../../../js/utils/playlistTracks";

jest.mock("axios");

const goldifyExecuteTestUtils = require("../../../__test_utils__/GoldifyExecuteTestUtils");
const playlistTracksTestUtils = require("../../../__test_utils__/playlistTracksTestUtils");

test("Confirm playlistTracksUrl returns the correct Spotify API URL including params", () => {
  const playlistId = "abc123";
  expect(playlistTracksUrl(playlistId)).toEqual(
    "https://api.spotify.com/v1/playlists/abc123/tracks"
  );
});

test("Gets Tracks by Playlist Id", async () => {
  const playlistId = "Abcd1234";

  const playlistTracksResponseData = playlistTracksTestUtils.playlistTracksById(
    playlistId
  );
  axios.get.mockResolvedValue({
    data: playlistTracksResponseData,
  });

  const responseData = await getPlaylistTracksById(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId
  );
  expect(responseData).toEqual(playlistTracksResponseData);
});

test("GetTracks throws error on bad data", async () => {
  const playlistId = "Abcd1234";

  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await getPlaylistTracksById(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await getPlaylistTracksById(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Replace Tracks by Playlist Id", async () => {
  const playlistId = "Abcd1234";
  const trackURIs = ["spotify:track:testTrack1", "spotify:track:testTrack2"];

  const playlistTracksResponseData = playlistTracksTestUtils.replacePlaylistTracksByIdAndURIs(
    playlistId,
    trackURIs
  );
  axios.put.mockResolvedValue({
    data: playlistTracksResponseData,
  });

  const responseData = await replacePlaylistTracks(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId,
    trackURIs
  );
  expect(responseData).toEqual(playlistTracksResponseData);
});

test("GetTracks throws error on bad data", async () => {
  const playlistId = "Abcd1234";
  const trackURIs = ["spotify:track:testTrack1", "spotify:track:testTrack2"];

  axios.put.mockResolvedValue(null);
  console.log = jest.fn();
  await replacePlaylistTracks(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId,
    trackURIs
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.put.mockResolvedValue(undefined);
  console.log = jest.fn();
  await replacePlaylistTracks(
    goldifyExecuteTestUtils.getTokensTestData(),
    playlistId,
    trackURIs
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Get URIs from List", async () => {
  const trackList = playlistTracksTestUtils.tracksWithURIs();
  const trackURIs = playlistTracksTestUtils.trackURIs();
  const result = getURIsFromList(trackList);
  expect(result).toEqual(trackURIs);
});

test("Get URIs from Empty List", async () => {
  const trackList = [];
  const trackURIs = [];
  const result = getURIsFromList(trackList);
  expect(result).toEqual(trackURIs);
});
