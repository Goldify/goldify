import axios from "axios";

export const retrieveUserDataAxios = async (retrievedTokenData) => {
  const headers = {
    headers: {
      Authorization: "Bearer " + retrievedTokenData.access_token,
    },
  };

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
