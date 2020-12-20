import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import TopListeningData from "../../../js/solo/top-listens/TopListeningData";
import Adapter from "enzyme-adapter-react-16";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import { retrieveTopListeningDataAxios } from "../../../js/utils/TopListeningDataUtils";
import {
  shortTermTracksRecommended,
  mediumTermTracksRecommended,
  longTermTracksRecommended,
} from "../../../js/utils/constants";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/TopListeningDataUtils", () => ({
  retrieveTopListeningDataAxios: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifySoloFixtures = require("../../../__fixtures__/GoldifySoloFixtures");
const topListeningDataFixtures = require("../../../__fixtures__/TopListeningDataFixtures");

const getTopListeningDataWrapper = () => {
  return shallow(
    <TopListeningData
      retrievedTokenData={{}}
      goldifyUriList={[topListeningDataFixtures.testUri]}
      addTrackHandler={jest.fn()}
      playlistDirty={false}
    />
  );
};

const getTopListeningDataWrapperEmptyPlaylist = () => {
  return shallow(
    <TopListeningData
      retrievedTokenData={{}}
      goldifyUriList={[]}
      addTrackHandler={jest.fn()}
      playlistDirty={false}
    />
  );
};

test("Test TopListeningData with and without retrievedTokenData", async () => {
  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().retrieveTopListeningData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTopListeningData).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySoloFixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTopListeningData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveTopListeningData).toHaveBeenCalledWith(
    goldifySoloFixtures.getTokensTestData()
  );
});

test("Test functionality: retrieveTopListeningData", async () => {
  retrieveTopListeningDataAxios.mockImplementation(() =>
    Promise.resolve(topListeningDataFixtures.getTopListeningData())
  );

  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveTopListeningData(goldifySoloFixtures.getTokensTestData());
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    topListeningData: topListeningDataFixtures.getTopListeningData().short_term,
    shortTermListeningData: topListeningDataFixtures.getTopListeningData()
      .short_term,
    mediumTermListeningData: topListeningDataFixtures.getTopListeningData()
      .medium_term,
    longTermListeningData: topListeningDataFixtures.getTopListeningData()
      .long_term,
  });
});

test("Expect home page to load when running retrieveTopListeningData with bad data", async () => {
  retrieveTopListeningDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = getTopListeningDataWrapper();
  await wrapper
    .instance()
    .retrieveTopListeningData(goldifySoloFixtures.getTokensTestData());
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Confirm an error occurs when attempting to grab the top listen data component without setting the top listen data", () => {
  const wrapper = getTopListeningDataWrapper();
  let errorThrown = false;
  try {
    wrapper.instance().getTopListeningDataDiv();
  } catch (err) {
    expect(err).toEqual(TypeError("Cannot read property 'items' of null"));
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);
});

test("Check for top listen data in top listen data page after setting the state", () => {
  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().state = {
    topListeningData: topListeningDataFixtures.getTopListeningData().short_term,
  };
  let topListeningDataDivString = JSON.stringify(
    wrapper.instance().getTopListeningDataDiv()
  );
  expect(topListeningDataDivString).toContain(
    topListeningDataFixtures.testAlbumName
  );
  expect(topListeningDataDivString).toContain(
    topListeningDataFixtures.testSongName
  );
  expect(topListeningDataDivString).toContain(
    topListeningDataFixtures.testPopularity
  );
  expect(topListeningDataDivString).toContain(
    topListeningDataFixtures.testAlbumArtImageURL
  );
  expect(topListeningDataDivString).toContain(
    topListeningDataFixtures.testArtistName1
  );
  expect(topListeningDataDivString).toContain(
    topListeningDataFixtures.testArtistName2
  );
});

test("Check for which div is loaded on render for TopListeningData", () => {
  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().getTopListeningDataDiv = jest
    .fn()
    .mockReturnValue("Top Listens Table!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.topListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
});

test("Check that empty playlists are automatically given recommendations", () => {
  const wrapper = getTopListeningDataWrapperEmptyPlaylist();
  wrapper.instance().getTopListeningDataDiv = jest
    .fn()
    .mockReturnValue("Top Listens Table!");
  jest.spyOn(window, "alert").mockImplementation(() => {});
  wrapper.instance().state.topListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  wrapper.instance().state.shortTermListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  wrapper.instance().state.mediumTermListeningData = topListeningDataFixtures.getTopListeningData().medium_term;
  wrapper.instance().state.longTermListeningData = topListeningDataFixtures.getTopListeningData().long_term;
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
  expect(wrapper.instance().props.addTrackHandler).toHaveBeenCalledTimes(
    shortTermTracksRecommended +
      mediumTermTracksRecommended +
      longTermTracksRecommended
  );
});

test("Check that empty playlists are not given tracks if top listening data wasn't retrieved", () => {
  const wrapper = getTopListeningDataWrapperEmptyPlaylist();
  wrapper.instance().getTopListeningDataDiv = jest
    .fn()
    .mockReturnValue("Top Listens Table!");
  jest.spyOn(window, "alert").mockImplementation(() => {});
  wrapper.instance().state.topListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
  expect(wrapper.instance().props.addTrackHandler).toHaveBeenCalledTimes(0);
});

test("Check that non-empty playlists are NOT automatically given recommendations", () => {
  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().getTopListeningDataDiv = jest
    .fn()
    .mockReturnValue("Top Listens Table!");
  wrapper.instance().state.topListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  wrapper.instance().state.shortTermListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  wrapper.instance().state.mediumTermListeningData = topListeningDataFixtures.getTopListeningData().medium_term;
  wrapper.instance().state.longTermListeningData = topListeningDataFixtures.getTopListeningData().long_term;
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
  expect(wrapper.instance().props.addTrackHandler).toHaveBeenCalledTimes(0);
});

test("Check for accurate includes for goldifyPlaylistContainsTrack", () => {
  const wrapper = getTopListeningDataWrapper();
  expect(
    wrapper
      .instance()
      .goldifyPlaylistContainsTrack(topListeningDataFixtures.testUri)
  ).toEqual(true);
  expect(wrapper.instance().goldifyPlaylistContainsTrack("BAD_URI")).toEqual(
    false
  );
});

test("Expect add handler called on AddCircleIcon button", () => {
  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().setState({
    topListeningData: topListeningDataFixtures.getTopListeningData().short_term,
  });
  wrapper.find(".top-listens-add-track").simulate("click");
  expect(wrapper.instance().props.addTrackHandler).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().props.addTrackHandler).toHaveBeenCalledWith(
    topListeningDataFixtures.getTopListeningData().short_term.items[1]
  );
});

test("Confirm updateTopListeningDataTerm updates the top listens term", () => {
  const wrapper = getTopListeningDataWrapper();
  wrapper.instance().state = {
    selectedTerm: 0,
    topListeningData: topListeningDataFixtures.getTopListeningData().short_term,
    shortTermListeningData: topListeningDataFixtures.getTopListeningData()
      .short_term,
    mediumTermListeningData: topListeningDataFixtures.getTopListeningData()
      .medium_term,
    longTermListeningData: topListeningDataFixtures.getTopListeningData()
      .long_term,
  };
  wrapper.instance().setState = jest.fn();

  wrapper.instance().updateTopListeningDataTerm({}, 0);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: 0,
    topListeningData: topListeningDataFixtures.getTopListeningData().short_term,
  });

  wrapper.instance().updateTopListeningDataTerm({}, 1);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(2);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: 1,
    topListeningData: topListeningDataFixtures.getTopListeningData()
      .medium_term,
  });

  wrapper.instance().updateTopListeningDataTerm({}, 2);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(3);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: 1,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  });

  let errorThrown = false;
  try {
    wrapper.instance().updateTopListeningDataTerm({}, undefined);
  } catch (err) {
    expect(err).toEqual(Error("Value cannot be undefined: {}"));
    errorThrown = true;
  }
  expect(errorThrown);
});
