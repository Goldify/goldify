import React from "react";
import '@testing-library/jest-dom';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyExecutePage from '../js/execute/GoldifyExecutePage';
import UserInfo from '../js/execute/user-info/UserInfo';
import {
  retrieveTokensAxios,
  retrieveUserDataAxios,
  retrieveAuthenticationCode,
  replaceWindowURL,
  getLoadingPage
} from '../js/utils/GoldifyExecuteUtils';

jest.mock('../js/utils/GoldifyExecuteUtils', () => ({
  retrieveAuthenticationCode: jest.fn(),
  retrieveAuthorization: jest.fn(),
  retrieveTokensAxios: jest.fn(),
  retrieveUserDataAxios: jest.fn(),
  replaceWindowURL: jest.fn(),
  getLoadingPage: jest.fn()
}));

configure({ adapter: new Adapter() });

const goldifyExecuteTestUtils = require("../__test_utils__/GoldifyExecuteTestUtils");

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

test("Test UserInfo with and without retrievedTokenData", async () => {
  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  wrapper.instance().retrieveUserData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveUserData).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifyExecuteTestUtils.getTokensTestData()
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveUserData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveUserData).toHaveBeenCalledWith(
    goldifyExecuteTestUtils.getTokensTestData()
  );
});

test("Test GoldifyExecutePage functionality: retrieveUserData", async () => {
  retrieveUserDataAxios.mockImplementation(() => Promise.resolve(
    goldifyExecuteTestUtils.getUserTestData()
  ));

  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  wrapper.instance().setState = jest.fn();
  await wrapper.instance().retrieveUserData(
    goldifyExecuteTestUtils.getTokensTestData()
  );
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    userData: goldifyExecuteTestUtils.getUserTestData()
  });
});

test("Expect home page to load when running retrieveUserData with bad data", async () => {
  retrieveUserDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  await wrapper.instance().retrieveUserData(
    goldifyExecuteTestUtils.getTokensTestData()
  );
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

test("Confirm an error occurs when attempting to grab the user data page without setting the user data", () => {
  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  let errorThrown = false;
  try {
    wrapper.instance().getUserInfoDiv();
  } catch (err) {
    expect(err).toEqual(TypeError("Cannot read property 'images' of null"));
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);
});

test("Check for user data in user data page after setting the state", () => {
  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  wrapper.instance().state = {
    userData: goldifyExecuteTestUtils.getUserTestData()
  };
  let userInfoDivString = JSON.stringify(wrapper.instance().getUserInfoDiv());
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserImageURL);
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserFollowersTotal);
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserExternalUrlSpotify);
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserCountry);
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserId);
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserDisplayName);
  expect(userInfoDivString).toContain(goldifyExecuteTestUtils.testUserEmail);
});

test("Check for which div is loaded on render for UserInfo", () => {
  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  getLoadingPage.mockReturnValue("Loading Page!");
  wrapper.instance().getUserInfoDiv = jest.fn().mockReturnValue("User Info Div!");
  expect(wrapper.instance().render()).toEqual("Loading Page!");
  wrapper.instance().state.userData = goldifyExecuteTestUtils.getUserTestData();
  expect(wrapper.instance().render()).toEqual("User Info Div!");
});