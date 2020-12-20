import React from "react";
import axios from "axios";
import qs from "qs";

export var clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Your client id
export var clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret
export var redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param   {number} length The length of the string
 * @returns {string} The generated string
 */
export const generateRandomString = (length) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Grabs the auth code after spotify has authenticated the user
 * @returns {string} Auth code giving access to the user's spotify data
 */
export const retrieveAuthenticationCode = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get("code");
};

/**
 * Determines which api scopes are needed to take full use of this app
 * @returns {string} A space-separated list of goldify's required api scopes
 */
export const retrieveSpotifyApiScopesNeeded = () => {
  return [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "playlist-modify-public",
    "playlist-modify-private",
    "ugc-image-upload",
    "playlist-read-private",
  ].join(" ");
};

/**
 * Creates the url that allows the user to authorize the use of their data
 * @returns {string} Spotify's auth url for this user
 */
export const retrieveSpotifyApiAuthorizeURL = () => {
  return (
    "" +
    "https://accounts.spotify.com/authorize?" +
    qs.stringify({
      response_type: "code",
      client_id: clientId,
      scope: retrieveSpotifyApiScopesNeeded(),
      redirect_uri: redirectUri,
      state: generateRandomString(16),
    })
  );
};

/**
 * Redirects to spotify's user authorization page
 */
export const retrieveAuthorization = () => {
  replaceWindowURL(retrieveSpotifyApiAuthorizeURL());
};

/**
 * Calls spotify's api to get the user's auth tokens
 * @param   {string} authCode the user's authorization code
 * @returns {object} Object containing the user's access token
 */
export const retrieveTokensAxios = async (authCode) => {
  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
  };
  const data = {
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code: authCode,
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Will redirect the user to the provided url
 * @param   {string} url URL to direct the user to
 */
export const replaceWindowURL = (url) => {
  window.location.replace(url);
};

/**
 * Displays a basic loading page while we wait for something to happen
 * @returns {?} A div with some loading text
 */
export const getLoadingPage = () => {
  return (
    <div className="goldify-page-container">
      <h3>Loading...</h3>
    </div>
  );
};
