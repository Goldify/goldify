import axios from "axios";
import { basicHeaders } from "./axiosHelpers";

export var shortTermTimeRangeQueryParam = "short_term";
export var mediumTermTimeRangeQueryParam = "medium_term";
export var longTermTimeRangeQueryParam = "long_term";
export var limitQueryParam = "20";
export var offsetQueryParam = "0";

export const getTopListeningDataSpotifyApiURL = (timeRangeQueryParam) => {
  return (
    "" +
    "https://api.spotify.com/v1/me/top/tracks" +
    "?time_range=" +
    timeRangeQueryParam +
    "&limit=" +
    limitQueryParam +
    "&offset=" +
    offsetQueryParam
  );
};

export const retrieveTopListeningDataAxios = async (retrievedTokenData) => {
  const headers = basicHeaders(retrievedTokenData);
  try {
    const shortTermResponse = await axios.get(
      getTopListeningDataSpotifyApiURL(shortTermTimeRangeQueryParam),
      headers
    );
    const mediumTermResponse = await axios.get(
      getTopListeningDataSpotifyApiURL(mediumTermTimeRangeQueryParam),
      headers
    );
    const longTermResponse = await axios.get(
      getTopListeningDataSpotifyApiURL(longTermTimeRangeQueryParam),
      headers
    );
    return {
      short_term: shortTermResponse.data,
      medium_term: mediumTermResponse.data,
      long_term: longTermResponse.data,
    };
  } catch (error) {
    console.log(error);
  }
};
