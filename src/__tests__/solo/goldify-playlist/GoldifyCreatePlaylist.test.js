import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyCreatePlaylist from "../../../js/solo/goldify-playlist/GoldifyCreatePlaylist";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import {
  createGoldifyPlaylist,
  uploadPlaylistImage,
} from "../../../js/utils/playlist";
import {
  GOLDIFY_PLAYLIST_NAME,
  GOLDIFY_PLAYLIST_DESCRIPTION,
} from "../../../js/utils/constants";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/playlist", () => ({
  createGoldifyPlaylist: jest.fn(),
  uploadPlaylistImage: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifySoloFixtures = require("../../../__fixtures__/GoldifySoloFixtures");
const userInfoFixtures = require("../../../__fixtures__/UserInfoFixtures");
const playlistFixtures = require("../../../__fixtures__/playlistFixtures");

const createdPlaylist = playlistFixtures.createGoldifyPlaylist(
  userInfoFixtures.getUserTestData().id,
  GOLDIFY_PLAYLIST_NAME,
  GOLDIFY_PLAYLIST_DESCRIPTION
);

const createGoldifyPlaylistWrapper = () => {
  return shallow(
    <GoldifyCreatePlaylist
      retrievedTokenData={{}}
      userData={{
        id: userInfoFixtures.getUserTestData().id,
      }}
      playlistUpdater={jest.fn()}
    />
  );
};

test("Test functionality: createNewGoldifyPlaylist", async () => {
  createGoldifyPlaylist.mockImplementation(() =>
    Promise.resolve(createdPlaylist)
  );
  uploadPlaylistImage.mockImplementation(() => Promise.resolve(null));

  const wrapper = createGoldifyPlaylistWrapper();
  wrapper.instance().handlePlaylistCreated = jest.fn();
  await wrapper
    .instance()
    .createNewGoldifyPlaylist(
      goldifySoloFixtures.getTokensTestData(),
      userInfoFixtures.getUserTestData().id
    );
  expect(wrapper.instance().handlePlaylistCreated).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().handlePlaylistCreated).toHaveBeenCalledWith(
    createdPlaylist
  );
  // Upload image after playlist is created
  expect(uploadPlaylistImage).toHaveBeenCalledTimes(1);
});

test("Expect alert, home page when running createGoldifyPlaylist with bad data", async () => {
  createGoldifyPlaylist.mockImplementation(() => Promise.resolve(null));
  jest.spyOn(window, "alert").mockImplementation(() => {});

  const wrapper = createGoldifyPlaylistWrapper();
  await wrapper
    .instance()
    .createNewGoldifyPlaylist(
      goldifySoloFixtures.getTokensTestData(),
      userInfoFixtures.getUserTestData().id
    );
  expect(alert).toHaveBeenCalledTimes(1);
  // Don't attempt to upload image if playlist isn't created
  expect(uploadPlaylistImage).not.toHaveBeenCalled();
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for which div is loaded on render for createGoldifyPlaylist", () => {
  const wrapper = createGoldifyPlaylistWrapper();
  wrapper.instance().createPlaylistDiv = jest
    .fn()
    .mockReturnValue("Creating Goldify Playlist!");
  expect(wrapper.instance().render()).toEqual("Creating Goldify Playlist!");
});

test("Check for elements based on loading and success state", () => {
  const wrapper = createGoldifyPlaylistWrapper();

  wrapper.instance().state = {
    loading: false,
    success: false,
  };
  let createPlaylistDivString = JSON.stringify(
    wrapper.instance().createPlaylistDiv()
  );
  expect(createPlaylistDivString).toContain("Create Goldify Playlist");

  wrapper.instance().state = {
    loading: true,
    success: false,
  };
  createPlaylistDivString = JSON.stringify(
    wrapper.instance().createPlaylistDiv()
  );
  expect(createPlaylistDivString).not.toContain("Create Goldify Playlist");

  wrapper.instance().state = {
    loading: false,
    success: true,
  };
  createPlaylistDivString = JSON.stringify(
    wrapper.instance().createPlaylistDiv()
  );
  expect(createPlaylistDivString).not.toContain("Create Goldify Playlist");
});

test("Confirm createNewGoldifyPlaylistAction calls createNewGoldifyPlaylist", () => {
  const wrapper = createGoldifyPlaylistWrapper();
  wrapper.instance().createNewGoldifyPlaylist = jest.fn();
  wrapper.instance().createNewGoldifyPlaylistAction();
  expect(wrapper.instance().createNewGoldifyPlaylist).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().createNewGoldifyPlaylist).toHaveBeenCalledWith(
    {},
    userInfoFixtures.getUserTestData().id
  );
});

test("Confirm handleButtonClick sets state to loading, then calls createNewGoldifyPlaylistAction", () => {
  const wrapper = createGoldifyPlaylistWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().createNewGoldifyPlaylistAction = jest.fn();

  wrapper.instance().state.loading = true;
  wrapper.instance().handleButtonClick();
  expect(wrapper.instance().setState).not.toHaveBeenCalled();
  expect(
    wrapper.instance().createNewGoldifyPlaylistAction
  ).not.toHaveBeenCalled();

  wrapper.instance().state.loading = false;
  wrapper.instance().handleButtonClick();
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    loading: true,
    success: false,
  });
  expect(
    wrapper.instance().createNewGoldifyPlaylistAction
  ).toHaveBeenCalledTimes(1);
});

test("Confirm handlePlaylistCreated calls correct window timeouts and state is set to success", () => {
  jest.useFakeTimers();
  const wrapper = createGoldifyPlaylistWrapper();
  wrapper.instance().setState = jest.fn();
  wrapper.instance().handlePlaylistCreated({});
  jest.advanceTimersByTime(2000);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    loading: false,
    success: true,
  });
  expect(wrapper.instance().props.playlistUpdater).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1500);
  expect(wrapper.instance().props.playlistUpdater).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().props.playlistUpdater).toHaveBeenCalledWith({});
});
