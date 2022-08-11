import React from "react";
import "@testing-library/jest-dom";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import UserInfo from "../../../js/solo/user-info/UserInfo";
import goldifyLogo from "../../../assets/goldify_logo.png";

jest.mock("../../../js/utils/GoldifySoloUtils", () => ({
  replaceWindowURL: jest.fn(),
}));

configure({ adapter: new Adapter() });

const userInfoFixtures = require("../../../__fixtures__/UserInfoFixtures");

test("Test UserInfo with and without userData", async () => {
  const wrapper = shallow(<UserInfo userData={{}} />);
  wrapper.instance().setUserData = jest.fn();
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().setUserData).not.toHaveBeenCalled();

  wrapper.setProps({
    userData: userInfoFixtures.getUserTestData(),
  });
  wrapper.instance().componentDidMount();
  expect(wrapper.instance().setUserData).toHaveBeenCalledTimes(1);
  expect(wrapper.instance().setUserData).toHaveBeenCalledWith(
    userInfoFixtures.getUserTestData()
  );
});

test("Confirm an error occurs when attempting to grab the user data component without setting the user data", () => {
  const wrapper = shallow(<UserInfo userData={{}} />);
  let errorThrown = false;
  try {
    wrapper.instance().getUserInfoDiv();
  } catch (err) {
    expect(err).toEqual(
      TypeError("Cannot read properties of null (reading 'images')")
    );
    errorThrown = true;
  }
  expect(errorThrown).toBe(true);
});

test("Check for user data in user data page after setting the state", () => {
  const wrapper = shallow(
    <UserInfo userData={userInfoFixtures.getUserTestData()} />
  );
  let userInfoDivString = JSON.stringify(wrapper.instance().getUserInfoDiv());
  expect(userInfoDivString).toContain(userInfoFixtures.testUserImageURL);
  expect(userInfoDivString).toContain(userInfoFixtures.testUserDisplayName);
});

test("Check for which div is loaded on render for UserInfo", () => {
  const wrapper = shallow(<UserInfo userData={{}} />);
  wrapper.instance().getUserInfoDiv = jest
    .fn()
    .mockReturnValue("User Info Div!");
  expect(wrapper.instance().render()).toEqual(<div />);
  wrapper.instance().state.userData = userInfoFixtures.getUserTestData();
  expect(wrapper.instance().render()).toEqual("User Info Div!");
});

test("Confirm openUserSpotifyProfile opens a new tab with the User's Profile", () => {
  const wrapper = shallow(<UserInfo userData={{}} />);
  window.open = jest.fn();
  wrapper.instance().state.userData = userInfoFixtures.getUserTestData();
  wrapper.instance().openUserSpotifyProfile();
  expect(window.open).toHaveBeenCalledTimes(1);
  expect(window.open).toHaveBeenCalledWith(
    userInfoFixtures.testUserExternalUrlSpotify,
    "_blank"
  );
});

test("Check that default image is displayed if user has no profile picture", () => {
  let userDataNoImage = userInfoFixtures.getUserTestData();
  userDataNoImage.images = [];
  const wrapper = shallow(<UserInfo userData={userDataNoImage} />);
  let userInfoDivString = JSON.stringify(wrapper.instance().getUserInfoDiv());
  expect(userInfoDivString).toContain(goldifyLogo);
  expect(userInfoDivString).toContain(userInfoFixtures.testUserDisplayName);
});
