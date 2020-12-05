import axios from "axios";

export var timeRangeQueryParam = "short_term";
export var limitQueryParam = "20";
export var offsetQueryParam = "0";

export const getTopListeningDataSpotifyApiURL = () => {
  return "" +
    "https://api.spotify.com/v1/me/top/tracks" +
    "?time_range=" + timeRangeQueryParam +
    "&limit=" + limitQueryParam +
    "&offset=" + offsetQueryParam;
}

export const retrieveTopListeningDataAxios = async (retrievedTokenData) => {
  const headers = {
    headers: {
      "Authorization": "Bearer " + retrievedTokenData.access_token
    },
  };

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