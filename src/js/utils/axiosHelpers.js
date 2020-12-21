/**
 * Creates a basic header object using the retrieved tokens
 * @param   {object} retrievedTokenData The user's token data
 * @returns {object} Basic formatted request headers
 */
export const basicHeaders = (retrievedTokenData) => {
  return {
    headers: {
      Authorization: "Bearer " + retrievedTokenData.access_token,
    },
  };
};
