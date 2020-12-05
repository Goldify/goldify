import React from "react";
import '@testing-library/jest-dom';
import { configure, shallow } from "enzyme";
import TopListeningData from "../../../js/execute/top-listens/TopListeningData";
import Adapter from "enzyme-adapter-react-16";
import {
  replaceWindowURL
} from '../../../js/utils/GoldifyExecuteUtils';
import {
  retrieveTopListeningDataAxios
} from '../../../js/utils/TopListeningDataUtils';

jest.mock('../../../js/utils/GoldifyExecuteUtils', () => ({
  replaceWindowURL: jest.fn()
}));

jest.mock('../../../js/utils/TopListeningDataUtils', () => ({
  retrieveTopListeningDataAxios: jest.fn()
}));

configure({ adapter: new Adapter() });

const goldifyExecuteTestUtils = require("../../../__test_utils__/GoldifyExecuteTestUtils");
const topListeningDataTestUtils = require("../../../__test_utils__/TopListeningDataTestUtils");

test("Test TopListeningData with and without retrievedTokenData", async () => {
  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().retrieveTopListeningData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTopListeningData).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifyExecuteTestUtils.getTokensTestData()
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTopListeningData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveTopListeningData).toHaveBeenCalledWith(
    goldifyExecuteTestUtils.getTokensTestData()
  );
});

test("Test functionality: retrieveTopListeningData", async () => {
  retrieveTopListeningDataAxios.mockImplementation(() => Promise.resolve(
    topListeningDataTestUtils.getTopListeningData()
  ));

  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().setState = jest.fn();
  await wrapper.instance().retrieveTopListeningData(
    goldifyExecuteTestUtils.getTokensTestData()
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    topListeningData: topListeningDataTestUtils.getTopListeningData()
  });
});

test("Expect home page to load when running retrieveTopListeningData with bad data", async () => {
  retrieveTopListeningDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  await wrapper.instance().retrieveTopListeningData(
    goldifyExecuteTestUtils.getTokensTestData()
  );
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
    topListeningData: topListeningDataTestUtils.getTopListeningData()
  };
  let topListeningDataDivString = JSON.stringify(wrapper.instance().getTopListeningDataDiv());
  expect(topListeningDataDivString).toContain(topListeningDataTestUtils.testAlbumName);
  expect(topListeningDataDivString).toContain(topListeningDataTestUtils.testSongName);
  expect(topListeningDataDivString).toContain(topListeningDataTestUtils.testPopularity);
  expect(topListeningDataDivString).toContain(topListeningDataTestUtils.testAlbumArtImageURL);
  expect(topListeningDataDivString).toContain(topListeningDataTestUtils.testArtistName1);
  expect(topListeningDataDivString).toContain(topListeningDataTestUtils.testArtistName2);
});

test("Check for which div is loaded on render for TopListeningData", () => {
  const wrapper = shallow(<TopListeningData retrievedTokenData={{}} />);
  wrapper.instance().getTopListeningDataDiv = jest.fn().mockReturnValue("Top Listens Table!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.topListeningData = topListeningDataTestUtils.getTopListeningData();
  expect(wrapper.instance().render()).toEqual("Top Listens Table!");
});