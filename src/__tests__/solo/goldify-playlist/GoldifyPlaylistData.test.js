import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyPlaylistData from "../../../js/solo/goldify-playlist/GoldifyPlaylistData";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import { getPlaylistTracksById } from "../../../js/utils/playlistTracks";
import { GOLDIFY_PLAYLIST_NAME } from "../../../js/utils/constants";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
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
    />
  );
};

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
    Promise.resolve(playlistTracksFixtures.playlistTracksById(TEST_PLAYLIST_ID))
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
    playlistTracksFixtures.playlistTracksById(TEST_PLAYLIST_ID)
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
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
    playlistDirty: true,
  };
  let goldifyPlaylistDataDivString = JSON.stringify(
    wrapper.instance().getGoldifyPlaylistDiv()
  );
  expect(goldifyPlaylistDataDivString).toContain(
    `Your ${GOLDIFY_PLAYLIST_NAME} Playlist`
  );

  wrapper.instance().state = {
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
    playlistDirty: false,
  };
  goldifyPlaylistDataDivString = JSON.stringify(
    wrapper.instance().getGoldifyPlaylistDiv()
  );
  expect(goldifyPlaylistDataDivString).toContain(
    `Your ${GOLDIFY_PLAYLIST_NAME} Playlist`
  );
});

test("Check for which div is loaded on render for GoldifyPlaylistData", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().getGoldifyPlaylistDiv = jest
    .fn()
    .mockReturnValue("Goldify Playlist Table!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.goldifyPlaylistData = playlistTracksFixtures.playlistTracksById(
    TEST_PLAYLIST_ID
  );
  expect(wrapper.instance().render()).toEqual("Goldify Playlist Table!");
});

test("Test functionality: setInitialGoldifyPlaylistData", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setSavedGoldifyPlaylistData = jest.fn();
  wrapper.instance().setState = jest.fn();
  wrapper
    .instance()
    .setInitialGoldifyPlaylistData(
      playlistTracksFixtures.playlistTracksById(TEST_PLAYLIST_ID)
    );
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledWith(
    playlistTracksFixtures.playlistTracksById(TEST_PLAYLIST_ID)
  );
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual(TEST_URI_LIST);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
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
  wrapper.instance().goldifyPlaylistTrackUriList = undefined;
  let errorThrown = false;
  try {
    wrapper.instance().updateGoldifyPlaylist();
  } catch (err) {
    expect(err).toEqual(Error("Playlist Track Uri List cannot be undefined."));
    errorThrown = true;
  }
  expect(errorThrown).toEqual(true);

  wrapper.instance().goldifyPlaylistTrackUriList = [];
  wrapper.instance().state.goldifyPlaylistData = playlistTracksFixtures.playlistTracksById(
    TEST_PLAYLIST_ID
  );
  wrapper.instance().setSavedGoldifyPlaylistData = jest.fn();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().updateGoldifyPlaylist();
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().setSavedGoldifyPlaylistData).toHaveBeenCalledWith(
    playlistTracksFixtures.playlistTracksById(TEST_PLAYLIST_ID)
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    playlistDirty: false,
  });
});

test("Confirm cancelUpdatesToGoldifyPlaylist cancels any updates", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().savedGoldifyPlaylistData = playlistTracksFixtures.playlistTracksById(
    TEST_PLAYLIST_ID
  );
  wrapper.instance().goldifyPlaylistTrackUriList = [];
  wrapper.instance().cancelUpdatesToGoldifyPlaylist();
  expect(wrapper.instance().goldifyPlaylistTrackUriList).toEqual(TEST_URI_LIST);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
    playlistDirty: false,
  });
});

test("Confirm addTrackFromTopListensData adds track", () => {
  var testTrack = playlistTracksFixtures.testTrack("TEST_NAME", "TEST_ID");
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().addGoldifyPlaylistTrackUri = jest.fn();
  wrapper.instance().state.goldifyPlaylistData = { items: [] };

  wrapper.instance().addTrackFromTopListensData(testTrack);
  expect(wrapper.instance().addGoldifyPlaylistTrackUri).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().addGoldifyPlaylistTrackUri).toHaveBeenCalledWith(
    testTrack.uri
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: {
      items: [{ track: testTrack }],
    },
    playlistDirty: true,
  });

  wrapper.instance().goldifyPlaylistTrackUriList = [testTrack.uri];
  let errorThrown = false;
  try {
    wrapper.instance().addTrackFromTopListensData(testTrack);
  } catch (err) {
    errorThrown = true;
  }
  expect(errorThrown).toEqual(true);
});

test("Confirm removeGoldifyTrack removes the track", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().removeGoldifyPlaylistTrackUri = jest.fn();
  wrapper.instance().state.goldifyPlaylistData = playlistTracksFixtures.playlistTracksById(
    TEST_PLAYLIST_ID
  );
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
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
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
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
    playlistDirty: true,
  });
  wrapper.instance().updateGoldifyPlaylist = jest.fn();
  wrapper.find(".goldify-playlist-save-button").at(0).simulate("click");
  expect(wrapper.instance().updateGoldifyPlaylist).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().updateGoldifyPlaylist).toHaveBeenCalledWith();
});

test("Expect removeGoldifyTrack to be called on click of Remove button", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState({
    goldifyPlaylistData: playlistTracksFixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
    playlistDirty: true,
  });
  wrapper.instance().removeGoldifyTrack = jest.fn();
  wrapper.find(".goldify-playlist-remove-button").at(0).simulate("click");
  expect(wrapper.instance().removeGoldifyTrack).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().removeGoldifyTrack).toHaveBeenCalledWith(
    playlistTracksFixtures.testTrack("TEST_SONG_NAME_1", "TEST_SONG_ID_1").track
  );
});
