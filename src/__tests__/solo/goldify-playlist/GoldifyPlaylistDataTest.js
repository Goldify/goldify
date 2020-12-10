import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyPlaylistData from "../../../js/solo/goldify-playlist/GoldifyPlaylistData";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import { getPlaylistTracksById } from "../../../js/utils/playlistTracks";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlistTracks", () => ({
  getPlaylistTracksById: jest.fn(),
}));

configure({ adapter: new Adapter() });

const TEST_PLAYLIST_ID = "TEST_PLAYLIST_ID";

const goldifySolofixtures = require("../../../__fixtures__/GoldifySolofixtures");
const playlistTracksfixtures = require("../../../__fixtures__/playlistTracksfixtures");

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
    retrievedTokenData: goldifySolofixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylistData).toHaveBeenCalledTimes(
    1
  );
  expect(wrapper.instance().retrieveGoldifyPlaylistData).toHaveBeenCalledWith(
    goldifySolofixtures.getTokensTestData(),
    TEST_PLAYLIST_ID
  );
});

test("Test functionality: retrieveGoldifyPlaylistData", async () => {
  getPlaylistTracksById.mockImplementation(() =>
    Promise.resolve(playlistTracksfixtures.playlistTracksById(TEST_PLAYLIST_ID))
  );

  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylistData(
      goldifySolofixtures.getTokensTestData(),
      TEST_PLAYLIST_ID
    );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylistData: playlistTracksfixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
  });
});

test("Expect home page to load when running retrieveGoldifyPlaylistData with bad data", async () => {
  getPlaylistTracksById.mockImplementation(() => Promise.resolve());

  const wrapper = goldifyPlaylistDataWrapper();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylistData(
      goldifySolofixtures.getTokensTestData(),
      TEST_PLAYLIST_ID
    );
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for goldify playlist data in goldify playlist data page after setting the state", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().state = {
    goldifyPlaylistData: playlistTracksfixtures.playlistTracksById(
      TEST_PLAYLIST_ID
    ),
  };
  let goldifyPlaylistDataDivString = JSON.stringify(
    wrapper.instance().getGoldifyPlaylistDiv()
  );
  expect(goldifyPlaylistDataDivString).toContain("Your Goldify Playlist");
});

test("Check for which div is loaded on render for GoldifyPlaylistData", () => {
  const wrapper = goldifyPlaylistDataWrapper();
  wrapper.instance().getGoldifyPlaylistDiv = jest
    .fn()
    .mockReturnValue("Goldify Playlist Table!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.goldifyPlaylistData = playlistTracksfixtures.playlistTracksById(
    TEST_PLAYLIST_ID
  );
  expect(wrapper.instance().render()).toEqual("Goldify Playlist Table!");
});
