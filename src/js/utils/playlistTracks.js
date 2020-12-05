import axios from "axios";

/**
 * URL to get a playlist's tracks
 * @param  {string} playlistId ID of the requested playlist
 * @return {string} The playlist's url
 */
export const playlistTracksUrl = (playlistId) => {
  return "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";
};

/**
 * Calls Spotify's API to get the current tracks of a playlist
 * @param  {object} retrievedTokenData object containing tokens necessary for header
 * @param  {string} playlistId ID of the requested playlist
 * @return {object} The response data
 */
export const getPlaylistTracksById = async (retrievedTokenData, playlistId) => {
  const headers = {
    headers: {
      "Authorization": "Bearer " + retrievedTokenData.access_token
    },
  };

  try {
    const response = await axios.get(
      playlistTracksUrl(playlistId),
      headers
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Calls Spotify's API to replace the current tracks of a playlist
 * @param  {object} retrievedTokenData object containing tokens necessary for header
 * @param  {string} playlistId ID of the requested playlist
 * @return {object} The response data
 */
export const replacePlaylistTracks = async (retrievedTokenData, playlistId, trackUris) => {
  const headers = {
    headers: {
      "Authorization": "Bearer " + retrievedTokenData.access_token
    },
  };
  const data = { uris: trackUris };
  try {
    const response = await axios.put(
      playlistTracksUrl(playlistId),
      data,
      headers
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Transforms the output of the track items list to get a list of uris
 * @param  {array} trackList list of "items" in the response object
 * @return {array} The list of track uris
 */
export const getURIsFromList = (trackList) => {
  return trackList.map(track => {
    // a playlist track object has a track object within
    return track.track.uri;
  });
}