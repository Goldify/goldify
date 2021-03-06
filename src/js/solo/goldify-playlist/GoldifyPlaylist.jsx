import React, { Component } from "react";
import PropTypes from "prop-types";
import GoldifyPlaylistData from "./GoldifyPlaylistData";
import GoldifyCreatePlaylist from "./GoldifyCreatePlaylist";
import { findExistingGoldifyPlaylistByName } from "../../utils/playlist";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { GOLDIFY_PLAYLIST_NAME, HOME_PAGE_PATH } from "../../utils/constants";
import _ from "lodash";

class GoldifyPlaylist extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      goldifyPlaylist: undefined,
      goldifyPlaylistId: "",
      newlyCreatedPlaylist: false,
    };
    this.updatePlaylist = this.updatePlaylist.bind(this);
  }

  /**
   * Function used to update this component's state from within a child component
   * @param   {object} playlist Playlist object returned from spotify's api
   */
  updatePlaylist(playlist) {
    // used to set playlist after creating a new playlist
    this.setState({
      goldifyPlaylist: playlist,
      goldifyPlaylistId: playlist.id,
      newlyCreatedPlaylist: true,
    });
  }

  /**
   * Checks to see if the user has an existing goldify playlist once
   * token data is available
   */
  componentDidMount() {
    if (!_.isEmpty(this.props.retrievedTokenData)) {
      this.retrieveGoldifyPlaylist(this.props.retrievedTokenData);
    }
  }

  /**
   * Call's spotify's api to check if the user has an existing Goldify playlist
   * Then sets this component's state accordingly
   * @param   {object} retrievedTokenData Object containing the user's access token
   */
  async retrieveGoldifyPlaylist(retrievedTokenData) {
    await findExistingGoldifyPlaylistByName(
      retrievedTokenData,
      GOLDIFY_PLAYLIST_NAME
    ).then((data) => {
      if (data === null) {
        this.setState({
          goldifyPlaylist: null,
        });
      } else if (data === undefined || data.error) {
        replaceWindowURL(HOME_PAGE_PATH);
      } else {
        this.setState({
          goldifyPlaylist: data,
          goldifyPlaylistId: data.id,
        });
      }
    });
  }
  /**
   * Displays the user's Goldify Playlist if available
   * Otherwise redirects to page to create one
   * @returns {HTMLElement} A div to either create or display the user's Goldify playlist
   */
  render() {
    if (this.state.goldifyPlaylist === undefined) {
      return <div />;
    } else if (this.state.goldifyPlaylist === null) {
      return (
        <GoldifyCreatePlaylist
          retrievedTokenData={this.props.retrievedTokenData}
          userData={this.props.userData}
          playlistUpdater={this.updatePlaylist} // used to update playlist state
        />
      );
    } else {
      return (
        <GoldifyPlaylistData
          retrievedTokenData={this.props.retrievedTokenData}
          goldifyPlaylistId={this.state.goldifyPlaylistId}
          newlyCreatedPlaylist={this.state.newlyCreatedPlaylist}
          autoFillCompletedHandler={this.props.autoFillCompletedHandler}
        />
      );
    }
  }
}

GoldifyPlaylist.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  autoFillCompletedHandler: PropTypes.func.isRequired,
};

export default GoldifyPlaylist;
