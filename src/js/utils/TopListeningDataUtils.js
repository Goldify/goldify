import axios from "axios";
import { basicHeaders } from "./axiosHelpers";

export var timeRangeQueryParam = "short_term";
export var limitQueryParam = "20";
export var offsetQueryParam = "0";

export const getTopListeningDataSpotifyApiURL = () => {
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
    const response = await axios.get(
      getTopListeningDataSpotifyApiURL(),
      headers
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
