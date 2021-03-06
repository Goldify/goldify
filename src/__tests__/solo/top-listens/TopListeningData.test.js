import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import TopListeningData from "../../../js/solo/top-listens/TopListeningData";
import Adapter from "enzyme-adapter-react-16";
import {
  replaceWindowURL,
  getSpotifyRedirectURL,
} from "../../../js/utils/GoldifySoloUtils";
import { retrieveTopListeningDataAxios } from "../../../js/utils/TopListeningDataUtils";
import {
  shortTermTracksRecommended,
  mediumTermTracksRecommended,
  longTermTracksRecommended,
  RECENT_TAB_VALUE,
  RECURRING_TAB_VALUE,
  EVERLASTING_TAB_VALUE,
  RECENTLY_REMOVED_TAB_VALUE,
} from "../../../js/utils/constants";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
  getSpotifyRedirectURL: jest.fn(),
}));

jest.mock("../../../js/utils/TopListeningDataUtils", () => ({
  retrieveTopListeningDataAxios: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifySoloFixtures = require("../../../__fixtures__/GoldifySoloFixtures");
const topListeningDataFixtures = require("../../../__fixtures__/TopListeningDataFixtures");

const getTopListeningDataWrapper = (
  removedTrackDataRetVal = { items: [] },
  trackListRetValue = [topListeningDataFixtures.testUri]
) => {
  return shallow(
    <TopListeningData
      retrievedTokenData={{}}
      goldifyUriList={trackListRetValue}
      addTrackHandler={jest.fn()}
      playlistDirty={false}
      newlyCreatedPlaylist={false}
      onAutoFillCompleteHandler={jest.fn()}
      getRemovedTrackData={jest.fn().mockReturnValue(removedTrackDataRetVal)}
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
    topListeningDataFixtures.testTrackName
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
  expect(getSpotifyRedirectURL).toHaveBeenCalled();
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "album",
    topListeningDataFixtures.testAlbumId
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "track",
    topListeningDataFixtures.testTrackId
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "artist",
    topListeningDataFixtures.testArtistId1
  );
  expect(getSpotifyRedirectURL).toHaveBeenCalledWith(
    "artist",
    topListeningDataFixtures.testArtistId2
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
  const wrapper = getTopListeningDataWrapper({ items: [] }, []);
  wrapper.instance().getTopListeningDataDiv = jest
    .fn()
    .mockReturnValue("Top Listens Table!");
  wrapper.instance().state.topListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  wrapper.instance().state.shortTermListeningData = topListeningDataFixtures.getTopListeningData().short_term;
  wrapper.instance().state.mediumTermListeningData = topListeningDataFixtures.getTopListeningData().medium_term;
  wrapper.instance().state.longTermListeningData = topListeningDataFixtures.getTopListeningData().long_term;
  wrapper.instance().newlyCreatedPlaylist = true;
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
  expect(wrapper.instance().props.addTrackHandler).toHaveBeenCalledTimes(
    shortTermTracksRecommended +
      mediumTermTracksRecommended +
      longTermTracksRecommended
  );
  expect(wrapper.instance().newlyCreatedPlaylist).toEqual(false);
});

test("Feed autoFillGoldifyPlaylist empty data and expect no callouts", () => {
  const wrapper = getTopListeningDataWrapper({ items: [] }, []);
  wrapper.instance().state.shortTermListeningData = {
    items: [],
  };
  wrapper.instance().state.mediumTermListeningData = {
    items: [],
  };
  wrapper.instance().state.longTermListeningData = {
    items: [],
  };
  wrapper.instance().autoFillGoldifyPlaylist();
  expect(wrapper.instance().props.addTrackHandler).not.toHaveBeenCalled();
});

test("Check that empty playlists are not given tracks if top listening data wasn't retrieved", () => {
  const wrapper = getTopListeningDataWrapper({ items: [] }, []);
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
  const wrapper = getTopListeningDataWrapper(
    topListeningDataFixtures.getTopListeningData().long_term
  );
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

  wrapper
    .instance()
    .updateTopListeningDataTerm({ target: { value: RECENT_TAB_VALUE } });
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: RECENT_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().short_term,
  });

  wrapper
    .instance()
    .updateTopListeningDataTerm({ target: { value: RECURRING_TAB_VALUE } });
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(2);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: RECURRING_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData()
      .medium_term,
  });

  wrapper
    .instance()
    .updateTopListeningDataTerm({ target: { value: EVERLASTING_TAB_VALUE } });
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(3);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: EVERLASTING_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  });

  wrapper.instance().updateTopListeningDataTerm({
    target: { value: RECENTLY_REMOVED_TAB_VALUE },
  });
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(4);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    selectedTerm: RECENTLY_REMOVED_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  });

  let errorThrown = false;
  try {
    wrapper.instance().updateTopListeningDataTerm(undefined);
  } catch (err) {
    expect(err).toEqual(Error("Event cannot be undefined"));
    errorThrown = true;
  }
  expect(errorThrown);
});

test("Expect getRemovedTrackData() called only for Recently Removed", () => {
  const wrapper = getTopListeningDataWrapper(
    topListeningDataFixtures.getTopListeningData().long_term
  );
  wrapper.instance().getTopListeningDataItemDiv = jest.fn();
  wrapper.instance().render = jest.fn();
  let NUM_LONG_TERM_ITEMS = topListeningDataFixtures.getTopListeningData()
    .long_term.items.length;

  wrapper.instance().state = {
    selectedTerm: RECENT_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  };
  wrapper.instance().getTopListeningDataDiv();
  expect(wrapper.instance().props.getRemovedTrackData).not.toHaveBeenCalled();
  // Start at 2, as on load of the wrapper
  // instance this function will be called once
  expect(wrapper.instance().getTopListeningDataItemDiv).toHaveBeenCalledTimes(
    NUM_LONG_TERM_ITEMS
  );

  wrapper.instance().state = {
    selectedTerm: RECURRING_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  };
  wrapper.instance().getTopListeningDataDiv();
  expect(wrapper.instance().props.getRemovedTrackData).not.toHaveBeenCalled();
  expect(wrapper.instance().getTopListeningDataItemDiv).toHaveBeenCalledTimes(
    NUM_LONG_TERM_ITEMS * 2
  );

  wrapper.instance().state = {
    selectedTerm: EVERLASTING_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  };
  wrapper.instance().getTopListeningDataDiv();
  expect(wrapper.instance().props.getRemovedTrackData).not.toHaveBeenCalled();
  expect(wrapper.instance().getTopListeningDataItemDiv).toHaveBeenCalledTimes(
    NUM_LONG_TERM_ITEMS * 3
  );

  wrapper.instance().state = {
    selectedTerm: RECENTLY_REMOVED_TAB_VALUE,
    topListeningData: topListeningDataFixtures.getTopListeningData().long_term,
  };
  wrapper.instance().getTopListeningDataDiv();
  expect(wrapper.instance().props.getRemovedTrackData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().getTopListeningDataItemDiv).toHaveBeenCalledTimes(
    NUM_LONG_TERM_ITEMS * 4
  );
});
