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

test("Test GoldifyCreatePlaylist with and without required props", async () => {
  const wrapper = shallow(
    <GoldifyCreatePlaylist
      retrievedTokenData={{}}
      userData={{}}
      playlistUpdater={jest.fn()}
    />
  );
  wrapper.instance().createNewGoldifyPlaylist = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().createNewGoldifyPlaylist).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySoloFixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().createNewGoldifyPlaylist).not.toHaveBeenCalled();

  wrapper.setProps({
    userData: userInfoFixtures.getUserTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().createNewGoldifyPlaylist).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().createNewGoldifyPlaylist).toHaveBeenCalledWith(
    goldifySoloFixtures.getTokensTestData(),
    userInfoFixtures.getUserTestData().id
  );
});

test("Test functionality: createNewGoldifyPlaylist", async () => {
  createGoldifyPlaylist.mockImplementation(() =>
    Promise.resolve(createdPlaylist)
  );
  uploadPlaylistImage.mockImplementation(() => Promise.resolve(null));
  jest.spyOn(window, "alert").mockImplementation(() => {});

  const wrapper = shallow(
    <GoldifyCreatePlaylist
      retrievedTokenData={{}}
      userData={{}}
      playlistUpdater={jest.fn()}
    />
  );
  await wrapper
    .instance()
    .createNewGoldifyPlaylist(
      goldifySoloFixtures.getTokensTestData(),
      userInfoFixtures.getUserTestData().id
    );
  expect(alert).toHaveBeenCalledTimes(1);
  // Upload image after playlist is created
  expect(uploadPlaylistImage).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().props.playlistUpdater).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().props.playlistUpdater).toHaveBeenCalledWith(
    createdPlaylist
  );
});

test("Expect alert, home page when running createGoldifyPlaylist with bad data", async () => {
  createGoldifyPlaylist.mockImplementation(() => Promise.resolve(null));
  jest.spyOn(window, "alert").mockImplementation(() => {});

  const wrapper = shallow(
    <GoldifyCreatePlaylist
      retrievedTokenData={{}}
      userData={{}}
      playlistUpdater={jest.fn()}
    />
  );
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
  const wrapper = shallow(
    <GoldifyCreatePlaylist
      retrievedTokenData={{}}
      userData={{}}
      playlistUpdater={jest.fn()}
    />
  );
  wrapper.instance().createPlaylistDiv = jest
    .fn()
    .mockReturnValue("Creating Goldify Playlist!");
  expect(wrapper.instance().render()).toEqual("Creating Goldify Playlist!");
});
