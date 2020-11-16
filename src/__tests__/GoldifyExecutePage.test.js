import React from "react";
import '@testing-library/jest-dom';
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifyExecutePage from '../js/GoldifyExecutePage';
import {
  retrieveTokensAxios,
  retrieveUserDataAxios,
  retrieveAuthenticationCode,
  replaceWindowURL
} from '../utils/GoldifyExecuteUtils';

jest.mock('../utils/GoldifyExecuteUtils', () => ({
  retrieveAuthenticationCode: jest.fn(),
  retrieveAuthorization: jest.fn(),
  retrieveTokensAxios: jest.fn(),
  retrieveUserDataAxios: jest.fn(),
  replaceWindowURL: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifyExecuteTestUtils = require("../utils/GoldifyExecuteTestUtils");

test("Confirm authorization code in componentDidMount is sent to retrieveDataOnPageLoad", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().retrieveDataOnPageLoad = jest.fn();

  retrieveAuthenticationCode.mockReturnValue(goldifyExecuteTestUtils.testAuthenticationCode);

  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveDataOnPageLoad).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveDataOnPageLoad).toHaveBeenCalledWith(
    goldifyExecuteTestUtils.testAuthenticationCode
  );
});

test("Test GoldifyExecutePage functionality: retrieveDataOnPageLoad", async () => {
  retrieveTokensAxios.mockImplementation(() => Promise.resolve(
    goldifyExecuteTestUtils.getTokensTestData()
  ));

  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().retrieveUserData = jest.fn();
  await wrapper.instance().retrieveDataOnPageLoad(goldifyExecuteTestUtils.testAuthenticationCode);
  expect(wrapper.instance().retrieveUserData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveUserData).toHaveBeenCalledWith(
    goldifyExecuteTestUtils.testAuthenticationCode,
    goldifyExecuteTestUtils.getTokensTestData()
  );
});

test("Expect home page to load when running retrieveDataOnPageLoad with bad data", async () => {
  retrieveTokensAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<GoldifyExecutePage />);
  await wrapper.instance().retrieveDataOnPageLoad(goldifyExecuteTestUtils.testAuthenticationCode);
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Test GoldifyExecutePage functionality: retrieveUserData", async () => {
  retrieveUserDataAxios.mockImplementation(() => Promise.resolve(
    goldifyExecuteTestUtils.getUserTestData()
  ));

  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().setStateTokensAndUserData = jest.fn();
  await wrapper.instance().retrieveUserData(
    goldifyExecuteTestUtils.testAuthenticationCode,
    goldifyExecuteTestUtils.getTokensTestData()
  );
  expect(wrapper.instance().setStateTokensAndUserData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setStateTokensAndUserData).toHaveBeenCalledWith(
    goldifyExecuteTestUtils.testAuthenticationCode,
    goldifyExecuteTestUtils.getTokensTestData(),
    goldifyExecuteTestUtils.getUserTestData()
  );
});

test("Expect home page to load when running retrieveUserData with bad data", async () => {
  retrieveUserDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<GoldifyExecutePage />);
  await wrapper.instance().retrieveUserData(
    goldifyExecuteTestUtils.testAuthenticationCode,
    goldifyExecuteTestUtils.getTokensTestData()
  );
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Confirm state is altered after calling setStateTokensAndUserData", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  expect(wrapper.instance().state).toEqual({
    authorizationCode: "",
    refreshToken: "",
    accessToken: "",
    userData: null,
    userDataString: ""
  });
  wrapper.instance().setStateTokensAndUserData(
    goldifyExecuteTestUtils.testAuthenticationCode,
    goldifyExecuteTestUtils.getTokensTestData(),
    goldifyExecuteTestUtils.getUserTestData()
  );
  expect(wrapper.instance().state).toEqual({
    authorizationCode: goldifyExecuteTestUtils.testAuthenticationCode,
    refreshToken: goldifyExecuteTestUtils.getTokensTestData().refresh_token,
    accessToken: goldifyExecuteTestUtils.getTokensTestData().access_token,
    userData: goldifyExecuteTestUtils.getUserTestData(),
    userDataString: JSON.stringify(goldifyExecuteTestUtils.getUserTestData())
  });
});

test("Check for Loading... in loading page", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  let loadingPageString = JSON.stringify(wrapper.instance().getLoadingPage());
  expect(loadingPageString).toContain("Loading...");
});

test("Confirm an error occurs when attempting to grab the user data page without setting the user data", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  let errorThrown = false;
  try {
    wrapper.instance().getUserDataPage();
  } catch (err) {
    expect(err).toEqual(TypeError("Cannot read property 'images' of null"));
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);
});

test("Check for user data in user data page after setting the state", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().state = {
    authorizationCode: goldifyExecuteTestUtils.testAuthenticationCode,
    refreshToken: goldifyExecuteTestUtils.getTokensTestData().refresh_token,
    accessToken: goldifyExecuteTestUtils.getTokensTestData().access_token,
    userData: goldifyExecuteTestUtils.getUserTestData(),
    userDataString: JSON.stringify(goldifyExecuteTestUtils.getUserTestData())
  };
  let userDataString = JSON.stringify(wrapper.instance().getUserDataPage());
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserImageURL);
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserFollowersTotal);
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserExternalUrlSpotify);
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserCountry);
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserId);
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserDisplayName);
  expect(userDataString).toContain(goldifyExecuteTestUtils.testUserEmail);
});

test("Confirm the functionality of tokensAndOrDataAreInvalid", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  expect(wrapper.instance().tokensAndOrDataAreInvalid()).toBe(true);
  wrapper.instance().state.authorizationCode = goldifyExecuteTestUtils.testAuthenticationCode;
  expect(wrapper.instance().tokensAndOrDataAreInvalid()).toBe(true);
  wrapper.instance().state.accessToken = goldifyExecuteTestUtils.testAccessToken;
  expect(wrapper.instance().tokensAndOrDataAreInvalid()).toBe(true);
  wrapper.instance().state.userData = goldifyExecuteTestUtils.getUserTestData();
  expect(wrapper.instance().tokensAndOrDataAreInvalid()).toBe(false);
});

test("Check for which page is loaded on render based on tokensAndOrDataAreInvalid", () => {
  const wrapper = shallow(<GoldifyExecutePage />);
  wrapper.instance().getLoadingPage = jest.fn().mockReturnValue("Loading Page!");
  wrapper.instance().getUserDataPage = jest.fn().mockReturnValue("User Data Page!");
  wrapper.instance().tokensAndOrDataAreInvalid = jest.fn().mockReturnValue(true);
  expect(wrapper.instance().render()).toEqual("Loading Page!");
  wrapper.instance().tokensAndOrDataAreInvalid = jest.fn().mockReturnValue(false);
  expect(wrapper.instance().render()).toEqual("User Data Page!");
});