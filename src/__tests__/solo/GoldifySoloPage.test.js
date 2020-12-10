import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import GoldifySoloPage from "../../js/Solo/GoldifySoloPage";
import {
  retrieveTokensAxios,
  retrieveAuthenticationCode,
  replaceWindowURL,
  getLoadingPage,
} from "../../js/utils/GoldifySoloUtils";

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

const goldifySolofixtures = require("../../__fixtures__/GoldifySolofixtures");

test("Confirm authorization code in componentDidMount is sent to retrieveTokensOnPageLoad", () => {
  const wrapper = shallow(<GoldifySoloPage />);
  wrapper.instance().retrieveTokensOnPageLoad = jest.fn();

  retrieveAuthenticationCode.mockReturnValue(
    goldifySolofixtures.testAuthenticationCode
  );

  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveTokensOnPageLoad).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveTokensOnPageLoad).toHaveBeenCalledWith(
    goldifySolofixtures.testAuthenticationCode
  );
});

test("Test GoldifySoloPage functionality: retrieveTokensOnPageLoad", async () => {
  retrieveTokensAxios.mockImplementation(() =>
    Promise.resolve(goldifySolofixtures.getTokensTestData())
  );

  const wrapper = shallow(<GoldifySoloPage />);
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveTokensOnPageLoad(goldifySolofixtures.testAuthenticationCode);
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    retrievedTokenData: goldifySolofixtures.getTokensTestData(),
  });
});

test("Expect home page to load when running retrieveTokensOnPageLoad with bad data", async () => {
  retrieveTokensAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<GoldifySoloPage />);
  await wrapper
    .instance()
    .retrieveTokensOnPageLoad(goldifySolofixtures.testAuthenticationCode);
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
  wrapper.instance().state.retrievedTokenData = goldifySolofixtures.getTokensTestData();
  expect(wrapper.instance().render()).toEqual("Goldify Page!");
});

test("Check for goldify page container class", () => {
  const wrapper = shallow(<GoldifySoloPage />);
  wrapper.instance().state.retrievedTokenData = goldifySolofixtures.getTokensTestData();
  let goldifyPageString = JSON.stringify(wrapper.instance().getGoldifyPage());
  expect(goldifyPageString).toContain('"className":"goldify-page-container"');
});
