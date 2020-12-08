import React from "react";
import axios from "axios";
import qs from "qs";

export var clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Your client id
export var clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret
export var redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = (length) => {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const retrieveAuthenticationCode = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get("code");
};

export const retrieveSpotifyApiScopesNeeded = () => {
  return [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "playlist-read-private",
    
  ].join(" ");
}

export const retrieveSpotifyApiAuthorizeURL = () => {
  return "" +
    "https://accounts.spotify.com/authorize?" +
    qs.stringify({
      response_type: "code",
      client_id: clientId,
      scope: retrieveSpotifyApiScopesNeeded(),
      redirect_uri: redirectUri,
      state: generateRandomString(16)
    });
}

export const retrieveAuthorization = () => {
  replaceWindowURL(retrieveSpotifyApiAuthorizeURL());
};

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

export const replaceWindowURL = (url) => {
  window.location.replace(url);
};

export const getLoadingPage = () => {
  return (
    <div className="goldify-page-container">
      <h3>Loading...</h3>
    </div>
  );
}