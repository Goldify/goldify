import "@testing-library/jest-dom";
import axios from "axios";
import { retrieveUserDataAxios } from "../../../js/utils/UserInfoUtils";

jest.mock("axios");

const goldifySolofixtures = require("../../../__fixtures__/GoldifySolofixtures");
const userInfofixtures = require("../../../__fixtures__/UserInfofixtures");

test("Check for to make sure retrieveUserDataAxios returns correct mock data", async () => {
  axios.get.mockResolvedValue({
    data: userInfofixtures.getUserTestData(),
  });

  const responseData = await retrieveUserDataAxios(
    goldifySolofixtures.getTokensTestData()
  );
  expect(responseData).toEqual(userInfofixtures.getUserTestData());
});

test("Check for to make sure retrieveUserDataAxios throws error on bad data", async () => {
  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await retrieveUserDataAxios(goldifySolofixtures.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await retrieveUserDataAxios(goldifySolofixtures.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});
