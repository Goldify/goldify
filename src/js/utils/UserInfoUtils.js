import axios from "axios";
import { basicHeaders } from "./axiosHelpers";

/**
 * Gets a user's own profile data
 * @param   {object} retrievedTokenData Object containing the user's access token
 * @returns {object} The user's profile data
 */
export const retrieveUserDataAxios = async (retrievedTokenData) => {
  const headers = basicHeaders(retrievedTokenData);

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
