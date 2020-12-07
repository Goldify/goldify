export const basicHeaders = (retrievedTokenData) => {
  return {
    headers: {
      Authorization: "Bearer " + retrievedTokenData.access_token,
    },
  };
};
