import React from "react";
import '@testing-library/jest-dom';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyExecutePage from '../../js/execute/GoldifyExecutePage';
import {
  retrieveTokensAxios,
  retrieveAuthenticationCode,
  replaceWindowURL,
  getLoadingPage
} from '../../js/utils/GoldifyExecuteUtils';

jest.mock('../../js/utils/GoldifyExecuteUtils', () => ({
  retrieveAuthenticationCode: jest.fn(),
  retrieveAuthorization: jest.fn(),
  retrieveTokensAxios: jest.fn(),
  replaceWindowURL: jest.fn(),
  getLoadingPage: jest.fn()
}));

jest.mock('../../js/utils/UserInfoUtils', () => ({
  retrieveUserDataAxios: jest.fn()
}));

configure({ adapter: new Adapter() });

const goldifyExecuteTestUtils = require("../../__test_utils__/GoldifyExecuteTestUtils");

test("Confirm authorization code in componentDidMount is sent to retrieveTokensOnPageLoad", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().retrieveTokensOnPageLoad = jest.fn();

  retrieveAuthenticationCode.mockReturnValue(goldifyExecuteTestUtils.testAuthenticationCode);

  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTokensOnPageLoad).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveTokensOnPageLoad).toHaveBeenCalledWith(
    goldifyExecuteTestUtils.testAuthenticationCode
  );
});

test("Test GoldifyExecutePage functionality: retrieveTokensOnPageLoad", async () => {
  retrieveTokensAxios.mockImplementation(() => Promise.resolve(
    goldifyExecuteTestUtils.getTokensTestData()
  ));

  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().setState = jest.fn();
  await wrapper.instance().retrieveTokensOnPageLoad(goldifyExecuteTestUtils.testAuthenticationCode);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    retrievedTokenData: goldifyExecuteTestUtils.getTokensTestData()
  });
});

test("Expect home page to load when running retrieveTokensOnPageLoad with bad data", async () => {
  retrieveTokensAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<GoldifyExecutePage />);
  await wrapper.instance().retrieveTokensOnPageLoad(goldifyExecuteTestUtils.testAuthenticationCode);
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for which page is loaded on render for GoldifyExecutePage", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  getLoadingPage.mockReturnValue("Loading Page!");
  wrapper.instance().getGoldifyPage = jest.fn().mockReturnValue("Goldify Page!");
  expect(wrapper.instance().render()).toEqual("Loading Page!");
  wrapper.instance().state.retrievedTokenData = goldifyExecuteTestUtils.getTokensTestData();
  expect(wrapper.instance().render()).toEqual("Goldify Page!");
});

test("Check for goldify page container class", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().state.retrievedTokenData = goldifyExecuteTestUtils.getTokensTestData();
  let goldifyPageString = JSON.stringify(wrapper.instance().getGoldifyPage());
  expect(goldifyPageString).toContain("\"className\":\"goldify-page-container\"");
});