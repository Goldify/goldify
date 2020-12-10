import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import TopListeningData from "../../../js/Solo/top-listens/TopListeningData";
import Adapter from "enzyme-adapter-react-16";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import { retrieveTopListeningDataAxios } from "../../../js/utils/TopListeningDataUtils";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/TopListeningDataUtils", () => ({
  retrieveTopListeningDataAxios: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifySolofixtures = require("../../../__fixtures__/GoldifySolofixtures");
const topListeningDatafixtures = require("../../../__fixtures__/TopListeningDatafixtures");

test("Test TopListeningData with and without retrievedTokenData", async () => {
  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().retrieveTopListeningData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTopListeningData).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySolofixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTopListeningData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveTopListeningData).toHaveBeenCalledWith(
    goldifySolofixtures.getTokensTestData()
  );
});

test("Test functionality: retrieveTopListeningData", async () => {
  retrieveTopListeningDataAxios.mockImplementation(() =>
    Promise.resolve(topListeningDatafixtures.getTopListeningData())
  );

  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveTopListeningData(goldifySolofixtures.getTokensTestData());
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    topListeningData: topListeningDatafixtures.getTopListeningData(),
  });
});

test("Expect home page to load when running retrieveTopListeningData with bad data", async () => {
  retrieveTopListeningDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  await wrapper
    .instance()
    .retrieveTopListeningData(goldifySolofixtures.getTokensTestData());
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Confirm an error occurs when attempting to grab the top listen data component without setting the top listen data", () => {
  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
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
  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().state = {
    topListeningData: topListeningDatafixtures.getTopListeningData(),
  };
  let topListeningDataDivString = JSON.stringify(
    wrapper.instance().getTopListeningDataDiv()
  );
  expect(topListeningDataDivString).toContain(
    topListeningDatafixtures.testAlbumName
  );
  expect(topListeningDataDivString).toContain(
    topListeningDatafixtures.testSongName
  );
  expect(topListeningDataDivString).toContain(
    topListeningDatafixtures.testPopularity
  );
  expect(topListeningDataDivString).toContain(
    topListeningDatafixtures.testAlbumArtImageURL
  );
  expect(topListeningDataDivString).toContain(
    topListeningDatafixtures.testArtistName1
  );
  expect(topListeningDataDivString).toContain(
    topListeningDatafixtures.testArtistName2
  );
});

test("Check for which div is loaded on render for TopListeningData", () => {
  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().getTopListeningDataDiv = jest
    .fn()
    .mockReturnValue("Top Listens Table!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.topListeningData = topListeningDatafixtures.getTopListeningData();
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
});
