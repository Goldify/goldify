import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import UserInfo from "../../../js/Solo/user-info/UserInfo";
import { replaceWindowURL } from "../../../js/utils/GoldifySoloUtils";
import { retrieveUserDataAxios } from "../../../js/utils/UserInfoUtils";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

jest.mock("../../../js/utils/UserInfoUtils", () => ({
  retrieveUserDataAxios: jest.fn(),
}));

configure({ adapter: new Adapter() });

const goldifySolofixtures = require("../../../__fixtures__/GoldifySolofixtures");
const userInfofixtures = require("../../../__fixtures__/UserInfofixtures");

test("Test UserInfo with and without retrievedTokenData", async () => {
  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  wrapper.instance().retrieveUserData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveUserData).not.toHaveBeenCalled();

  wrapper.setProps({
    retrievedTokenData: goldifySolofixtures.getTokensTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().retrieveUserData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().retrieveUserData).toHaveBeenCalledWith(
    goldifySolofixtures.getTokensTestData()
  );
});

test("Test GoldifySoloPage functionality: retrieveUserData", async () => {
  retrieveUserDataAxios.mockImplementation(() =>
    Promise.resolve(userInfofixtures.getUserTestData())
  );

  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  wrapper.instance().setState = jest.fn();
  await wrapper
    .instance()
    .retrieveUserData(goldifySolofixtures.getTokensTestData());
  expect(wrapper.instance().setState).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setState).toHaveBeenCalledWith({
    userData: userInfofixtures.getUserTestData(),
  });
});

test("Expect home page to load when running retrieveUserData with bad data", async () => {
  retrieveUserDataAxios.mockImplementation(() => Promise.resolve());

  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  await wrapper
    .instance()
    .retrieveUserData(goldifySolofixtures.getTokensTestData());
  expect(replaceWindowURL).toHaveBeenCalledTimes(1);
  expect(replaceWindowURL).toHaveBeenCalledWith("/");
});

test("Confirm an error occurs when attempting to grab the user data component without setting the user data", () => {
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
    userData: userInfofixtures.getUserTestData(),
  };
  let userInfoDivString = JSON.stringify(wrapper.instance().getUserInfoDiv());
  expect(userInfoDivString).toContain(userInfofixtures.testUserImageURL);
  expect(userInfoDivString).toContain(userInfofixtures.testUserFollowersTotal);
  expect(userInfoDivString).toContain(
    userInfofixtures.testUserExternalUrlSpotify
  );
  expect(userInfoDivString).toContain(userInfofixtures.testUserCountry);
  expect(userInfoDivString).toContain(userInfofixtures.testUserId);
  expect(userInfoDivString).toContain(userInfofixtures.testUserDisplayName);
  expect(userInfoDivString).toContain(userInfofixtures.testUserEmail);
});

test("Check for which div is loaded on render for UserInfo", () => {
  const wrapper = shallow(<UserInfo retrievedTokenData={{}} />);
  wrapper.instance().getUserInfoDiv = jest
    .fn()
    .mockReturnValue("User Info Div!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.userData = userInfofixtures.getUserTestData();
  expect(wrapper.instance().render()).toEqual("User Info Div!");
});
