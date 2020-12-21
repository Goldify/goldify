import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { createGoldifyPlaylist } from "../../utils/playlist";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import {
  GOLDIFY_PLAYLIST_NAME,
  GOLDIFY_PLAYLIST_DESCRIPTION,
} from "../../utils/constants";

class GoldifyCreatePlaylist extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
  }

  /**
   * Creates a goldify playlist once retrievedTokenData and userData are set
   */
  componentDidMount() {
    if (
      !_.isEmpty(this.props.retrievedTokenData) &&
      !_.isEmpty(this.props.userData)
    ) {
      this.createNewGoldifyPlaylist(
        this.props.retrievedTokenData,
        this.props.userData.id
      );
    }
  }

  /**
   * Creates a goldify playlist for the user, since one was not found
   * @param  {object} retrievedTokenData User data containing an access_token
   * @param  {string} userId User's ID to create the playlist under
   * Then updates the current playlist using this response
   */
  async createNewGoldifyPlaylist(retrievedTokenData, userId) {
    await createGoldifyPlaylist(
      retrievedTokenData,
      userId,
      GOLDIFY_PLAYLIST_NAME,
      GOLDIFY_PLAYLIST_DESCRIPTION
    ).then((data) => {
      if (_.isEmpty(data) || data.error) {
        alert(`Unable to create your ${GOLDIFY_PLAYLIST_NAME} playlist.`);
        replaceWindowURL("/");
      } else {
        alert(
          `Congrats! Your ${GOLDIFY_PLAYLIST_NAME} playlist has been created.`
        );
        this.props.playlistUpdater(data);
      }
    });
  }

  /**
   * Shows text telling the user that their playlist is being created
   * @returns {HTMLElement} Basic div with an h3 header
   */
  createPlaylistDiv() {
    return (
      <div>
        <h3>Creating Playlist...</h3>
      </div>
    );
  }

  /**
   * Renders the loading div when a playlist is being created
   * @returns {HTMLElement} A div telling the user that a playlist is being created
   */
  render() {
    return this.createPlaylistDiv();
  }
}

GoldifyCreatePlaylist.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  playlistUpdater: PropTypes.func.isRequired,
};

export default GoldifyCreatePlaylist;
