import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifySoloPage from "../../js/solo/GoldifySoloPage";
import {
  retrieveTokensAxios,
  retrieveAuthenticationCode,
  replaceWindowURL,
  getLoadingPage,
} from "../../js/utils/GoldifySoloUtils";
import { retrieveUserDataAxios } from "../../js/utils/UserInfoUtils";

jest.mock("../../js/utils/GoldifySoloUtils", () => ({
  retrieveAuthenticationCode: jest.fn(),
  retrieveAuthorization: jest.fn(),
  retrieveTokensAxios: jest.fn(),
  replaceWindowURL: jest.fn(),
  getLoadingPage: jest.fn(),
}));

jest.mock("../../js/utils/UserInfoUtils", () => ({
  retrieveUserDataAxios: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifySoloFixtures = require("../../__fixtures__/GoldifySoloFixtures");
const userInfoFixtures = require("../../__fixtures__/UserInfoFixtures");

test("Confirm authorization code in componentDidMount is sent to retrieveTokensOnPageLoad", () => {
  const wrapper = shallow(<GoldifySoloPage />);
  wrapper.instance().retrieveDataOnPageLoad = jest.fn();

  retrieveAuthenticationCode.mockReturnValue(
    goldifySoloFixtures.testAuthenticationCode
  );

  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveDataOnPageLoad).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveDataOnPageLoad).toHaveBeenCalledWith(
    goldifySoloFixtures.testAuthenticationCode
  );
});

test("Test GoldifySoloPage functionality: retrieveDataOnPageLoad", async () => {
  retrieveTokensAxios.mockImplementation(() =>
    Promise.resolve(goldifySoloFixtures.getTokensTestData())
  );
  retrieveUserDataAxios.mockImplementation(() =>
    Promise.resolve(userInfoFixtures.getUserTestData())
  );

  const wrapper = shallow(<GoldifySoloPage />);
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveDataOnPageLoad(goldifySoloFixtures.testAuthenticationCode);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(2);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    retrievedTokenData: goldifySoloFixtures.getTokensTestData(),
  });
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    userData: userInfoFixtures.getUserTestData(),
  });
});

test("Expect home page to load when running retrieveTokensAxios with bad data", async () => {
  retrieveTokensAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<GoldifySoloPage />);
  await wrapper
    .instance()
    .retrieveDataOnPageLoad(goldifySoloFixtures.testAuthenticationCode);
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Expect home page to load when running retrieveUserDataAxios with bad data", async () => {
  retrieveTokensAxios.mockImplementation(() =>
    Promise.resolve(goldifySoloFixtures.getTokensTestData())
  );
  retrieveUserDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<GoldifySoloPage />);
  await wrapper
    .instance()
    .retrieveDataOnPageLoad(goldifySoloFixtures.testAuthenticationCode);
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Check for which page is loaded on render for GoldifySoloPage", () => {
  const wrapper = shallow(<GoldifySoloPage />);
  getLoadingPage.mockReturnValue("Loading Page!");
  wrapper.instance().getGoldifyPage = jest
    .fn()
    .mockReturnValue("Goldify Page!");
  expect(wrapper.instance().render()).toEqual("Loading Page!");
  wrapper.instance().state.retrievedTokenData = goldifySoloFixtures.getTokensTestData();
  wrapper.instance().state.userData = userInfoFixtures.getUserTestData();
  expect(wrapper.instance().render()).toEqual("Goldify Page!");
});

test("Check for goldify page container class", () => {
  const wrapper = shallow(<GoldifySoloPage />);
  wrapper.instance().state.retrievedTokenData = goldifySoloFixtures.getTokensTestData();
  wrapper.instance().state.userData = userInfoFixtures.getUserTestData();
  let goldifyPageString = JSON.stringify(wrapper.instance().getGoldifyPage());
  expect(goldifyPageString).toContain('"className":"goldify-page-container"');
});
