import "@testing-library/jest-dom";
import axios from "axios";
import { retrieveUserDataAxios } from "../../../js/utils/UserInfoUtils";

jest.mock("axios");

const goldifySoloFixtures = require("../../../__fixtures__/GoldifySoloFixtures");
const userInfoFixtures = require("../../../__fixtures__/UserInfoFixtures");

test("Check for to make sure retrieveUserDataAxios returns correct mock data", async () => {
  axios.get.mockResolvedValue({
    data: userInfoFixtures.getUserTestData(),
  });

  const responseData = await retrieveUserDataAxios(
    goldifySoloFixtures.getTokensTestData()
  );
  expect(responseData).toEqual(userInfoFixtures.getUserTestData());
});

test("Check for to make sure retrieveUserDataAxios throws error on bad data", async () => {
  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await retrieveUserDataAxios(goldifySoloFixtures.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await retrieveUserDataAxios(goldifySoloFixtures.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});
