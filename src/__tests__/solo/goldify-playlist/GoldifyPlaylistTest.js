import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyPlaylist from "../../../js/Solo/goldify-playlist/GoldifyPlaylist";
import GoldifyPlaylistData from "../../../js/Solo/goldify-playlist/GoldifyPlaylistData";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import { findExistingGoldifyPlaylistByName } from "../../../js/utils/playlist";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlist", () => ({
  findExistingGoldifyPlaylistByName: jest.fn(),
}));

configure({ adapter: new Adapter() });

const TEST_PLAYLIST_ID = "TEST_PLAYLIST_ID";

const goldifySolofixtures = require("../../../__fixtures__/GoldifySolofixtures");
const playlistfixtures = require("../../../__fixtures__/playlistfixtures");

test("Test GoldifyPlaylist with and without retrievedTokenData", async () => {
  const wrapper = shallow(<GoldifyPlaylist retrievedTokenData={{}} />);
  wrapper.instance().retrieveGoldifyPlaylist = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylist).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySolofixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylist).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveGoldifyPlaylist).toHaveBeenCalledWith(
    goldifySolofixtures.getTokensTestData()
  );
});

test("Test functionality: retrieveGoldifyPlaylist", async () => {
  findExistingGoldifyPlaylistByName.mockImplementation(() =>
    Promise.resolve(playlistfixtures.existingGoldifyPlaylist())
  );

  const wrapper = shallow(<GoldifyPlaylist retrievedTokenData={{}} />);
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylist(goldifySolofixtures.getTokensTestData());
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylist: playlistfixtures.existingGoldifyPlaylist(),
    goldifyPlaylistId: TEST_PLAYLIST_ID,
  });
});

test("Expect alert when running retrieveGoldifyPlaylist with no Goldify Playlist found", async () => {
  findExistingGoldifyPlaylistByName.mockImplementation(() =>
    Promise.resolve(null)
  );
  jest.spyOn(window, "alert").mockImplementation(() => {});

  const wrapper = shallow(<GoldifyPlaylist retrievedTokenData={{}} />);
  await wrapper
    .instance()
    .retrieveGoldifyPlaylist(goldifySolofixtures.getTokensTestData());
  expect(alert).toHaveBeenCalledTimes(1);
});

test("Expect home page to load when running retrieveGoldifyPlaylist with bad data", async () => {
  findExistingGoldifyPlaylistByName.mockImplementation(() =>
    Promise.resolve(undefined)
  );

  const wrapper = shallow(<GoldifyPlaylist retrievedTokenData={{}} />);
  await wrapper
    .instance()
    .retrieveGoldifyPlaylist(goldifySolofixtures.getTokensTestData());
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for which div is loaded on render for GoldifyPlaylist", () => {
  const wrapper = shallow(<GoldifyPlaylist retrievedTokenData={{}} />);
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.goldifyPlaylist = playlistfixtures.existingGoldifyPlaylist();
  expect(wrapper.instance().render()).toEqual(
    <GoldifyPlaylistData retrievedTokenData={{}} goldifyPlaylistId={""} />
  );
});
