import React from "react";
import ReactDOM from "react-dom";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyPlaylistData from "../../../js/solo/goldify-playlist/GoldifyPlaylistData";
import {
  replaceWindowURL,
  getSpotifyRedirectURL,
} from "../../../js/utils/GoldifySoloUtils";
import { getPlaylistTracksById } from "../../../js/utils/playlistTracks";
import { GOLDIFY_PLAYLIST_NAME } from "../../../js/utils/constants";
import { SortableList } from "../../../js/utils/GoldifyPlaylistDataElements";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
  getSpotifyRedirectURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlistTracks", () => ({
  getPlaylistTracksById: jest.fn(),
  replacePlaylistTracks: jest.fn(),
}));

configure({ adapter: new Adapter() });

const TEST_PLAYLIST_ID = "TEST_PLAYLIST_ID";
const TEST_URI_LIST = [
  "spotify:track:TEST_SONG_ID_1",
  "spotify:track:TEST_SONG_ID_2",
];

const goldifySoloFixtures = require("../../../__fixtures__/GoldifySoloFixtures");
const playlistTracksFixtures = require("../../../__fixtures__/playlistTracksFixtures");

const goldifyPlaylistDataWrapper = () => {
  return shallow(
    <GoldifyPlaylistData
      retrievedTokenData={{}}
      goldifyPlaylistId={TEST_PLAYLIST_ID}
      newlyCreatedPlaylist={false}
      autoFillCompletedHandler={jest.fn()}
    />
  );
};

const getPlaylistTracksData = () => {
  return playlistTracksFixtures.playlistTracksById(TEST_PLAYLIST_ID).items;
};

const removeTrackHandler = jest.fn();
const onSortEndHandler = jest.fn();

test("Test GoldifyPlaylistData with and without retrievedTokenData", async () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().retrieveGoldifyPlaylistData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylistData).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySoloFixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylistData).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().retrieveGoldifyPlaylistData).toHaveBeenCalledWith(
    goldifySoloFixtures.getTokensTestData(),
    TEST_PLAYLIST_ID
  );
});

test("Test functionality: retrieveGoldifyPlaylistData", async () => {
  getPlaylistTracksById.mockImplementation(() =>
    Promise.resolve({ items: getPlaylistTracksData() })
  );

  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setInitialGoldifyPlaylistData = jest.fn();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylistData(
      goldifySoloFixtures.getTokensTestData(),
      TEST_PLAYLIST_ID
    );
  expect(
    wrapper.instance().setInitialGoldifyPlaylistData
  ).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setInitialGoldifyPlaylistData).toHaveBeenCalledWith(
    getPlaylistTracksData()
  );
});

test("Expect home page to load when running retrieveGoldifyPlaylistData with bad data", async () => {
  getPlaylistTracksById.mockImplementation(() => Promise.resolve());

  const wrapper = goldifyPlaylistDataWrapper();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylistData(
      goldifySoloFixtures.getTokensTestData(),
      TEST_PLAYLIST_ID
    );
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for goldify playlist data in goldify playlist data page after setting the state", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().state = {
    goldifyPlaylistData: getPlaylistTracksData(),
    playlistDirty: true,
  };
  let goldifyPlaylistDataDivString = JSON.stringify(
    wrapper.instance().getGoldifyPlaylistDiv()
  );
  expect(goldifyPlaylistDataDivString).toContain(
    `Your ${GOLDIFY_PLAYLIST_NAME} Playlist`
  );

  wrapper.instance().state = {
    goldifyPlaylistData: getPlaylistTracksData(),
    playlistDirty: false,
  };
  goldifyPlaylistDataDivString = JSON.stringify(
    wrapper.instance().getGoldifyPlaylistDiv()
  );
  expect(goldifyPlaylistDataDivString).toContain(
    `Your ${GOLDIFY_PLAYLIST_NAME} Playlist`
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "playlist",
    TEST_PLAYLIST_ID
  );
});

test("Check for which div is loaded on render for GoldifyPlaylistData", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().getGoldifyPlaylistDiv = jest
    .fn()
    .mockReturnValue("Goldify Playlist Table!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.goldifyPlaylistData = getPlaylistTracksData();
  expect(wrapper.instance().render()).toEqual("Goldify Playlist Table!");
});

test("Test functionality: setInitialGoldifyPlaylistData", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setSavedGoldifyPlaylistData = jest.fn();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().setInitialGoldifyPlaylistData(getPlaylistTracksData());
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledWith(
    getPlaylistTracksData()
  );
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual(TEST_URI_LIST);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: getPlaylistTracksData(),
    playlistDirty: false,
  });
});

test("Confirm setSavedGoldifyPlaylistData uses JSON library", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  JSON.parse = jest.fn();
  JSON.stringify = jest.fn();
  wrapper.instance().setSavedGoldifyPlaylistData({});
  expect(JSON.parse).toHaveBeenCalledTimes(1);
  expect(JSON.stringify).toHaveBeenCalledTimes(1);
});

test("Confirm addGoldifyPlaylistTrackUri adds track URI", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().goldifyPlaylistTrackUriList = [];
  wrapper.instance().addGoldifyPlaylistTrackUri("TEST_URI");
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual(["TEST_URI"]);
});

test("Confrim removeGoldifyPlaylistTrackUri removes track URI", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().goldifyPlaylistTrackUriList = ["TEST_URI"];
  expect(wrapper.instance().goldifyPlaylistTrackUriList).not.toEqual([]);
  wrapper.instance().removeGoldifyPlaylistTrackUri("TEST_URI");
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual([]);
  let errorThrown = false;
  try {
    wrapper.instance().removeGoldifyPlaylistTrackUri("TEST_URI");
  } catch (err) {
    expect(err).toEqual(Error("Unable to remove track: TEST_URI"));
    errorThrown = true;
  }
  expect(errorThrown).toEqual(true);
});

test("Confirm updateGoldifyPlaylist updates goldify playlist", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().goldifyPlaylistTrackUriList = [];
  wrapper.instance().state.goldifyPlaylistData = getPlaylistTracksData();
  wrapper.instance().setSavedGoldifyPlaylistData = jest.fn();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().updateGoldifyPlaylist();
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledWith(
    getPlaylistTracksData()
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    playlistDirty: false,
    removedTrackDataMap: new Map(),
  });
});

test("Confirm cancelUpdatesToGoldifyPlaylist cancels any updates", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().savedGoldifyPlaylistData = getPlaylistTracksData();
  wrapper.instance().goldifyPlaylistTrackUriList = [];
  wrapper.instance().cancelUpdatesToGoldifyPlaylist();
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual(TEST_URI_LIST);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: getPlaylistTracksData(),
    playlistDirty: false,
    removedTrackDataMap: new Map(),
  });
});

test("Confirm cancelUpdatesToGoldifyPlaylist cleans removed tracks", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setURIListFromPlaylistData = jest.fn();
  wrapper.instance().setSavedGoldifyPlaylistData = jest.fn();
  wrapper.instance().setState = jest.fn();

  let testRemovedTrackDataMap = new Map();
  let expectedFinalRemovedTrackDataMap = new Map();
  testRemovedTrackDataMap.set(
    getPlaylistTracksData()[0].track.uri,
    getPlaylistTracksData()[0]
  );
  testRemovedTrackDataMap.set(
    getPlaylistTracksData()[1].track.uri,
    getPlaylistTracksData()[1]
  );
  expectedFinalRemovedTrackDataMap.set(
    getPlaylistTracksData()[0].track.uri,
    getPlaylistTracksData()[0]
  );
  let testPlaylistTracksData = getPlaylistTracksData();
  testPlaylistTracksData.splice(0, 2);

  wrapper.instance().goldifyPlaylistTrackUriList = [
    getPlaylistTracksData()[1].track.uri,
  ];
  wrapper.instance().savedGoldifyPlaylistData = getPlaylistTracksData().splice(
    0,
    1
  );
  wrapper.instance().state = {
    removedTrackDataMap: testRemovedTrackDataMap,
    goldifyPlaylistData: testPlaylistTracksData,
  };
  wrapper.instance().cancelUpdatesToGoldifyPlaylist();

  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: getPlaylistTracksData().splice(0, 1),
    playlistDirty: false,
    removedTrackDataMap: expectedFinalRemovedTrackDataMap,
  });
});

test("Confirm addTrackFromTopListensData adds track", () => {
  var testTrack = playlistTracksFixtures.testTrack("TEST_NAME", "TEST_ID");
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().addGoldifyPlaylistTrackUri = jest.fn();
  wrapper.instance().state.goldifyPlaylistData = [];

  wrapper.instance().addTrackFromTopListensData(testTrack);
  expect(wrapper.instance().addGoldifyPlaylistTrackUri).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().addGoldifyPlaylistTrackUri).toHaveBeenCalledWith(
    testTrack.uri
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: [{ track: testTrack }],
    playlistDirty: true,
  });

  wrapper.instance().goldifyPlaylistTrackUriList = [testTrack.uri];
  wrapper.instance().addTrackFromTopListensData(testTrack);
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual([
    testTrack.uri,
  ]);
});

test("Confirm removeGoldifyTrack removes the track", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().removeGoldifyPlaylistTrackUri = jest.fn();
  wrapper.instance().state.goldifyPlaylistData = getPlaylistTracksData();
  wrapper
    .instance()
    .removeGoldifyTrack(
      playlistTracksFixtures.testTrack("TEST_NAME", "TEST_SONG_ID_1").track
    );
  expect(
    wrapper.instance().removeGoldifyPlaylistTrackUri
  ).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().removeGoldifyPlaylistTrackUri).toHaveBeenCalledWith(
    playlistTracksFixtures.testTrack("TEST_NAME", "TEST_SONG_ID_1").track.uri
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);

  let errorThrown = false;
  try {
    wrapper
      .instance()
      .removeGoldifyTrack(
        playlistTracksFixtures.testTrack("TEST_NAME", "TEST_SONG_ID_1").track
      );
  } catch (err) {
    expect(err).toEqual(Error("Track not found: TEST_SONG_ID_1"));
    errorThrown = true;
  }
  expect(errorThrown).toEqual(true);
});

test("Expect cancelUpdatesToGoldifyPlaylist to be called on click of Cancel button", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState({
    goldifyPlaylistData: getPlaylistTracksData(),
    playlistDirty: true,
  });
  wrapper.instance().cancelUpdatesToGoldifyPlaylist = jest.fn();
  wrapper.find(".goldify-playlist-cancel-button").at(0).simulate("click");
  expect(
    wrapper.instance().cancelUpdatesToGoldifyPlaylist
  ).toHaveBeenCalledTimes(1);
  expect(
    wrapper.instance().cancelUpdatesToGoldifyPlaylist
  ).toHaveBeenCalledWith();
});

test("Expect updateGoldifyPlaylist to be called on click of Save button", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState({
    goldifyPlaylistData: getPlaylistTracksData(),
    playlistDirty: true,
  });
  wrapper.instance().updateGoldifyPlaylist = jest.fn();
  wrapper.find(".goldify-playlist-save-button").at(0).simulate("click");
  expect(wrapper.instance().updateGoldifyPlaylist).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().updateGoldifyPlaylist).toHaveBeenCalledWith();
});

test("Expect onSortEnd to call setState", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState({
    goldifyPlaylistData: getPlaylistTracksData(),
  });
  wrapper.instance().setState = jest.fn();
  wrapper.instance().onSortEnd(0, 1, getPlaylistTracksData());
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
});

test("Expect getRemovedTrackData() to return proper data", () => {
  const wrapper = goldifyPlaylistDataWrapper();

  expect(wrapper.instance().getRemovedTrackData()).toEqual({ items: [] });
  let testRemovedTrackDataMap = new Map();
  testRemovedTrackDataMap.set(
    getPlaylistTracksData()[0].uri,
    getPlaylistTracksData()[0]
  );
  wrapper.instance().state = {
    removedTrackDataMap: testRemovedTrackDataMap,
  };
  expect(wrapper.instance().getRemovedTrackData()).toEqual({
    items: [getPlaylistTracksData()[0]],
  });
});

test("Expect updateGoldifyPlaylist to clean re-added removed tracks", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setURIListFromPlaylistData = jest.fn();
  wrapper.instance().setSavedGoldifyPlaylistData = jest.fn();
  wrapper.instance().setState = jest.fn();

  let testRemovedTrackDataMap = new Map();
  let expectedFinalRemovedTrackDataMap = new Map();
  testRemovedTrackDataMap.set(
    getPlaylistTracksData()[0].track.uri,
    getPlaylistTracksData()[0]
  );
  testRemovedTrackDataMap.set(
    getPlaylistTracksData()[1].track.uri,
    getPlaylistTracksData()[1]
  );
  expectedFinalRemovedTrackDataMap.set(
    getPlaylistTracksData()[1].track.uri,
    getPlaylistTracksData()[1]
  );
  let testPlaylistTracksData = getPlaylistTracksData();
  testPlaylistTracksData.splice(0, 1);

  wrapper.instance().goldifyPlaylistTrackUriList = [
    getPlaylistTracksData()[0].track.uri,
  ];
  wrapper.instance().state = {
    removedTrackDataMap: testRemovedTrackDataMap,
    goldifyPlaylistData: testPlaylistTracksData,
  };
  wrapper.instance().updateGoldifyPlaylist();

  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    playlistDirty: false,
    removedTrackDataMap: expectedFinalRemovedTrackDataMap,
  });
});

test("Use ReactDOM Render to render the SortableList", () => {
  const table = document.createElement("table");
  ReactDOM.render(
    <SortableList
      goldifyPlaylistData={getPlaylistTracksData()}
      removeTrackContainerHandler={removeTrackHandler}
      onSortEnd={onSortEndHandler}
      useDragHandle
    />,
    table
  );
  const button = table.querySelector(".goldify-playlist-remove-button");
  expect(removeTrackHandler).toHaveBeenCalledTimes(0);
  button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(removeTrackHandler).toHaveBeenCalledTimes(1);
  expect(onSortEndHandler).toHaveBeenCalledTimes(0);
  expect(getSpotifyRedirectURL).toHaveBeenCalled();
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "album",
    playlistTracksFixtures.testAlbumId
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "track",
    playlistTracksFixtures.testTrackId1
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "track",
    playlistTracksFixtures.testTrackId2
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "artist",
    playlistTracksFixtures.testArtistId1
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "artist",
    playlistTracksFixtures.testArtistId2
  );
});
