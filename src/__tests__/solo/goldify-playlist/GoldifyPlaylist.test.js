import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyPlaylist from "../../../js/solo/goldify-playlist/GoldifyPlaylist";
import GoldifyPlaylistData from "../../../js/solo/goldify-playlist/GoldifyPlaylistData";
import GoldifyCreatePlaylist from "../../../js/solo/goldify-playlist/GoldifyCreatePlaylist";
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

const goldifySoloFixtures = require("../../../__fixtures__/GoldifySoloFixtures");
const playlistFixtures = require("../../../__fixtures__/playlistFixtures");

const testAutoFillCompletedHandler = jest.fn();

const goldifyPlaylistWrapper = () => {
  return shallow(
    <GoldifyPlaylist
      retrievedTokenData={{}}
      userData={{}}
      newlyCreatedPlaylist={false}
      autoFillCompletedHandler={testAutoFillCompletedHandler}
    />
  );
};

test("Test GoldifyPlaylist with and without retrievedTokenData", async () => {
  const wrapper = goldifyPlaylistWrapper();
  wrapper.instance().retrieveGoldifyPlaylist = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylist).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySoloFixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveGoldifyPlaylist).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveGoldifyPlaylist).toHaveBeenCalledWith(
    goldifySoloFixtures.getTokensTestData()
  );
});

test("Test functionality: retrieveGoldifyPlaylist", async () => {
  findExistingGoldifyPlaylistByName.mockImplementation(() =>
    Promise.resolve(playlistFixtures.existingGoldifyPlaylist())
  );

  const wrapper = goldifyPlaylistWrapper();
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylist(goldifySoloFixtures.getTokensTestData());
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    goldifyPlaylist: playlistFixtures.existingGoldifyPlaylist(),
    goldifyPlaylistId: TEST_PLAYLIST_ID,
  });
});

test("Expect alert when running retrieveGoldifyPlaylist with no Goldify Playlist found", async () => {
  findExistingGoldifyPlaylistByName.mockImplementation(() =>
    Promise.resolve(null)
  );
  jest.spyOn(window, "alert").mockImplementation(() => {});

  const wrapper = goldifyPlaylistWrapper();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylist(goldifySoloFixtures.getTokensTestData());
  expect(alert).toHaveBeenCalledTimes(1);
});

test("Expect home page to load when running retrieveGoldifyPlaylist with bad data", async () => {
  findExistingGoldifyPlaylistByName.mockImplementation(() =>
    Promise.resolve(undefined)
  );

  const wrapper = goldifyPlaylistWrapper();
  await wrapper
    .instance()
    .retrieveGoldifyPlaylist(goldifySoloFixtures.getTokensTestData());
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for which div is loaded on render for GoldifyPlaylist", () => {
  const wrapper = goldifyPlaylistWrapper();
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.goldifyPlaylist = playlistFixtures.existingGoldifyPlaylist();
  expect(wrapper.instance().render()).toEqual(
    <GoldifyPlaylistData
      retrievedTokenData={{}}
      goldifyPlaylistId={""}
      newlyCreatedPlaylist={false}
      autoFillCompletedHandler={testAutoFillCompletedHandler}
    />
  );
  wrapper.instance().updatePlaylist(playlistFixtures.createGoldifyPlaylist());
  expect(wrapper.instance().render()).toEqual(
    <GoldifyPlaylistData
      retrievedTokenData={{}}
      goldifyPlaylistId={playlistFixtures.testPlaylistId}
      newlyCreatedPlaylist={true}
      autoFillCompletedHandler={testAutoFillCompletedHandler}
    />
  );
  wrapper.instance().updatePlaylist = jest.fn;
  wrapper.instance().state.goldifyPlaylist = null;
  expect(wrapper.instance().render()).toEqual(
    <GoldifyCreatePlaylist
      retrievedTokenData={{}}
      userData={{}}
      playlistUpdater={jest.fn}
    />
  );
});
