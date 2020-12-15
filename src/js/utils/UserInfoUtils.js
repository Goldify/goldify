import axios from "axios";
import { basicHeaders } from "./axiosHelpers";

export const retrieveUserDataAxios = async (retrievedTokenData) => {
  const headers = basicHeaders(retrievedTokenData);

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
