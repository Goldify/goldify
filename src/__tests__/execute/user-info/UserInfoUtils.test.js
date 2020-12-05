import '@testing-library/jest-dom';
import axios from "axios";
import {
  retrieveUserDataAxios
} from '../../../js/utils/UserInfoUtils';

jest.mock('axios');

const goldifyExecuteTestUtils = require("../../../__test_utils__/GoldifyExecuteTestUtils");
const userInfoTestUtils = require("../../../__test_utils__/UserInfoTestUtils");

test("Check for to make sure retrieveUserDataAxios returns correct mock data", async () => {
  axios.get.mockResolvedValue({
    data: userInfoTestUtils.getUserTestData()
  });

  const responseData = await retrieveUserDataAxios(goldifyExecuteTestUtils.getTokensTestData());
  expect(responseData).toEqual(userInfoTestUtils.getUserTestData());
});

test("Check for to make sure retrieveUserDataAxios throws error on bad data", async () => {
  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await retrieveUserDataAxios(goldifyExecuteTestUtils.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(TypeError("Cannot read property 'data' of null"));
  
  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await retrieveUserDataAxios(goldifyExecuteTestUtils.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(TypeError("Cannot read property 'data' of undefined"));
});