import "@testing-library/jest-dom";
import axios from "axios";
import {
  playlistTracksUrl,
  getPlaylistTracksById,
  replacePlaylistTracks,
  getURIsFromList,
} from "../../../js/utils/playlistTracks";

jest.mock("axios");

const goldifySolofixtures = require("../../../__fixtures__/GoldifySolofixtures");
const playlistTracksfixtures = require("../../../__fixtures__/playlistTracksfixtures");

test("Confirm playlistTracksUrl returns the correct Spotify API URL including params", () => {
  const playlistId = "abc123";
  expect(playlistTracksUrl(playlistId)).toEqual(
    "https://api.spotify.com/v1/playlists/abc123/tracks"
  );
});

test("Gets Tracks by Playlist Id", async () => {
  const playlistId = "Abcd1234";

  const playlistTracksResponseData = playlistTracksfixtures.playlistTracksById(
    playlistId
  );
  axios.get.mockResolvedValue({
    data: playlistTracksResponseData,
  });

  const responseData = await getPlaylistTracksById(
    goldifySolofixtures.getTokensTestData(),
    playlistId
  );
  expect(responseData).toEqual(playlistTracksResponseData);
});

test("GetTracks throws error on bad data", async () => {
  const playlistId = "Abcd1234";

  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await getPlaylistTracksById(
    goldifySolofixtures.getTokensTestData(),
    playlistId
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await getPlaylistTracksById(
    goldifySolofixtures.getTokensTestData(),
    playlistId
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Replace Tracks by Playlist Id", async () => {
  const playlistId = "Abcd1234";
  const trackURIs = ["spotify:track:testTrack1", "spotify:track:testTrack2"];

  const playlistTracksResponseData = playlistTracksfixtures.replacePlaylistTracksByIdAndURIs(
    playlistId,
    trackURIs
  );
  axios.put.mockResolvedValue({
    data: playlistTracksResponseData,
  });

  const responseData = await replacePlaylistTracks(
    goldifySolofixtures.getTokensTestData(),
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
    goldifySolofixtures.getTokensTestData(),
    playlistId,
    trackURIs
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.put.mockResolvedValue(undefined);
  console.log = jest.fn();
  await replacePlaylistTracks(
    goldifySolofixtures.getTokensTestData(),
    playlistId,
    trackURIs
  );
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Get URIs from List", async () => {
  const trackList = playlistTracksfixtures.tracksWithURIs();
  const trackURIs = playlistTracksfixtures.trackURIs();
  const result = getURIsFromList(trackList);
  expect(result).toEqual(trackURIs);
});

test("Get URIs from Empty List", async () => {
  const trackList = [];
  const trackURIs = [];
  const result = getURIsFromList(trackList);
  expect(result).toEqual(trackURIs);
});
