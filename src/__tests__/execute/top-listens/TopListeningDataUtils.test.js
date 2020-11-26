import '@testing-library/jest-dom';
import axios from "axios";
import {
  retrieveTopListeningDataAxios,
  getTopListeningDataSpotifyApiURL,
  offsetQueryParam,
  limitQueryParam,
  timeRangeQueryParam
} from '../../../js/utils/TopListeningDataUtils';

jest.mock('axios');

const goldifyExecuteTestUtils = require("../../../__test_utils__/GoldifyExecuteTestUtils");
const topListeningDataTestUtils = require("../../../__test_utils__/TopListeningDataTestUtils");

test("Check for to make sure retrieveTopListeningDataAxios throws error on bad data", async () => {
  axios.get.mockResolvedValue(null);
  console.log = jest.fn();
  await retrieveTopListeningDataAxios(goldifyExecuteTestUtils.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(TypeError("Cannot read property 'data' of null"));
  
  axios.get.mockResolvedValue(undefined);
  console.log = jest.fn();
  await retrieveTopListeningDataAxios(goldifyExecuteTestUtils.getTokensTestData());
  expect(console.log).toHaveBeenCalledWith(TypeError("Cannot read property 'data' of undefined"));
});

test("Check for to make sure retrieveTopListeningDataAxios returns correct mock data", async () => {
  axios.get.mockResolvedValue({
    data: topListeningDataTestUtils.getTopListeningData()
  });

  const responseData = await retrieveTopListeningDataAxios(goldifyExecuteTestUtils.getTokensTestData());
  expect(responseData).toEqual(topListeningDataTestUtils.getTopListeningData());
});

test("Confirm getTopListeningDataSpotifyApiURL returns the correct Spotify API URL including params", () => {
  expect(getTopListeningDataSpotifyApiURL()).toEqual(
    "https://api.spotify.com/v1/me/top/tracks" +
    "?time_range=" + timeRangeQueryParam +
    "&limit=" + limitQueryParam +
    "&offset=" + offsetQueryParam
  );
});