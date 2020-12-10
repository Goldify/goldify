import "@testing-library/jest-dom";
import axios from "axios";
import qs from "qs";
import {
  clientId,
  redirectUri,
  generateRandomString,
  retrieveSpotifyApiScopesNeeded,
  retrieveSpotifyApiAuthorizeURL,
  retrieveAuthorization,
  retrieveAuthenticationCode,
  retrieveTokensAxios,
  replaceWindowURL,
  getLoadingPage,
} from "../../js/utils/GoldifySoloUtils";

jest.mock("axios");

const goldifySoloFixtures = require("../../__fixtures__/GoldifySoloFixtures");

test("Function to generate random function is random", () => {
  let randomStr1 = generateRandomString(16);
  let randomStr2 = generateRandomString(16);
  let randomStr3 = generateRandomString(16);
  expect(randomStr1).not.toEqual(randomStr2);
  expect(randomStr2).not.toEqual(randomStr3);
  expect(randomStr1).not.toEqual(randomStr3);
});

test("The Spotify API scopes string includes all scopes needed for Goldify", () => {
  let spotifyApiScope = retrieveSpotifyApiScopesNeeded();
  expect(spotifyApiScope).toContain("user-read-private");
  expect(spotifyApiScope).toContain("user-read-email");
  expect(spotifyApiScope).toContain("user-top-read");
  expect(spotifyApiScope).toContain("playlist-modify-public");
  expect(spotifyApiScope).toContain("ugc-image-upload");
});

test("The Spotify API Authorization URL has correct components in it", () => {
  let spotifyApiAuthURL = retrieveSpotifyApiAuthorizeURL();
  expect(spotifyApiAuthURL).toContain(
    "https://accounts.spotify.com/authorize?"
  );
  expect(spotifyApiAuthURL).toContain("response_type=code");
  expect(spotifyApiAuthURL).toContain("client_id=" + qs.stringify(clientId));
  expect(spotifyApiAuthURL).toContain("scope=");
  expect(spotifyApiAuthURL).toContain(
    "redirect_uri=" + qs.stringify(redirectUri)
  );
  expect(spotifyApiAuthURL).toContain("state=");
});

test("The function retrieveAuthorization attempts to replace the window with the Spotify API URL", () => {
  retrieveAuthorization();
  expect(window.location.replace).toHaveBeenCalledTimes(1);
});

test("Landing page should render null authentication code", () => {
  expect(retrieveAuthenticationCode()).toEqual(null);
});

test("Check for to make sure retrieveTokensAxios returns correct mock data", async () => {
  axios.post.mockResolvedValue({
    data: goldifySoloFixtures.getTokensTestData(),
  });

  const responseData = await retrieveTokensAxios();
  expect(responseData).toEqual(goldifySoloFixtures.getTokensTestData());
});

test("Check for to make sure retrieveTokensAxios throws error on bad data", async () => {
  axios.post.mockResolvedValue(null);
  console.log = jest.fn();
  await retrieveTokensAxios();
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of null")
  );

  axios.post.mockResolvedValue(undefined);
  console.log = jest.fn();
  await retrieveTokensAxios();
  expect(console.log).toHaveBeenCalledWith(
    TypeError("Cannot read property 'data' of undefined")
  );
});

test("Confirm replaceWindowURL replaces the window with the given URL", async () => {
  replaceWindowURL("TEST_URL");
  expect(window.location.replace).toHaveBeenCalledTimes(1);
  expect(window.location.replace).toHaveBeenCalledWith("TEST_URL");
});

test("Check for Loading... in loading page", () => {
  let loadingPageString = JSON.stringify(getLoadingPage());
  expect(loadingPageString).toContain("Loading...");
});
