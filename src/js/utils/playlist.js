import axios from "axios";
import { basicHeaders } from "./axiosHelpers";

export const limitQueryParam = 50;
/**
 * URL to create a playlist
 * @param  {string} userId ID of the user
 * @return {string} The user's playlists url
 */
export const createPlaylistUrl = (userId) => {
  return "https://api.spotify.com/v1/users/" + userId + "/playlists";
};

/**
 * Calls Spotify's API to create a new Goldify playlist
 * @param  {object} retrievedTokenData object containing tokens necessary for header
 * @param  {string} userId ID of the user
 * @param  {string} playlistName name of the Playlist to create
 * @param  {string} playlistDescription description of the desired playlist
 * @return {object} The response data
 */
export const createGoldifyPlaylist = async (
  retrievedTokenData,
  userId,
  playlistName,
  playlistDescription
) => {
  const headers = basicHeaders(retrievedTokenData);
  const data = { name: playlistName, description: playlistDescription };

  try {
    const response = await axios.post(createPlaylistUrl(userId), data, headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * URL to get a list of the user's playlists
 * @return {string} The logged-in user's playlists url
 */
export const getUserPlaylistsUrl = () => {
  return (
    "https://api.spotify.com/v1/me/playlists" + "?limit=" + limitQueryParam
  );
};

/**
 * Calls Spotify's API to see if the user already has a Goldify playlist
 * @param  {object} retrievedTokenData object containing tokens necessary for header
 * @param  {string} playlistName name of the Playlist to create
 * @return {object} The Goldify playlist, if it exists, null otherwise
 */
export const findExistingGoldifyPlaylistByName = async (
  retrievedTokenData,
  playlistName
) => {
  const headers = basicHeaders(retrievedTokenData);
  try {
    const response = await axios.get(getUserPlaylistsUrl(), headers);
    const playlists = response.data.items;
    let playlistFound = null; // null if no playlist found
    playlists.forEach((playlist) => {
      if (playlist.name == playlistName) {
        playlistFound = playlist;
      }
    });
    return playlistFound;
  } catch (error) {
    console.log(error);
  }
};

/**
 * URL to get a playlist by ID
 * @param  {string} playlistId ID of the playlist
 * @return {string} The playlist url
 */
export const getPlaylistUrl = (playlistId) => {
  return "https://api.spotify.com/v1/playlists/" + playlistId;
};

/**
 * Calls Spotify's API to create a new Goldify playlist
 * @param  {object} retrievedTokenData object containing tokens necessary for header
 * @param  {string} playlistId ID of the playlist
 * @return {object} The response data
 */
export const getPlaylistById = async (retrievedTokenData, playlistId) => {
  // Will be useful in future to integrate with backend work
  const headers = basicHeaders(retrievedTokenData);
  try {
    const response = await axios.get(getPlaylistUrl(playlistId), headers);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
