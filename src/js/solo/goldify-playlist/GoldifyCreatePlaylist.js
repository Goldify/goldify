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

  createPlaylistDiv() {
    return (
      <div>
        <h3>Creating Playlist...</h3>
      </div>
    );
  }

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
