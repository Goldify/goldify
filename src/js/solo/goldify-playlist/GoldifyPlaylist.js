import React, { Component } from "react";
import PropTypes from "prop-types";
import GoldifyPlaylistData from "./GoldifyPlaylistData";
import GoldifyCreatePlaylist from "./GoldifyCreatePlaylist";
import { findExistingGoldifyPlaylistByName } from "../../utils/playlist";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { GOLDIFY_PLAYLIST_NAME } from "../../utils/constants";
import _ from "lodash";

class GoldifyPlaylist extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      goldifyPlaylist: undefined,
      goldifyPlaylistId: "",
    };
    this.updatePlaylist = this.updatePlaylist.bind(this);
  }

  updatePlaylist(playlist) {
    // used to set playlist after creating a new playlist
    this.setState({
      goldifyPlaylist: playlist,
      goldifyPlaylistId: playlist.id,
    });
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.retrievedTokenData)) {
      this.retrieveGoldifyPlaylist(this.props.retrievedTokenData);
    }
  }

  async retrieveGoldifyPlaylist(retrievedTokenData) {
    await findExistingGoldifyPlaylistByName(
      retrievedTokenData,
      GOLDIFY_PLAYLIST_NAME
    ).then((data) => {
      if (data === null) {
        alert(
          `You don't have a ${GOLDIFY_PLAYLIST_NAME} playlist! Let's create one for you.`
        );
        this.setState({
          goldifyPlaylist: null,
        });
      } else if (data === undefined || data.error) {
        replaceWindowURL("/");
      } else {
        this.setState({
          goldifyPlaylist: data,
          goldifyPlaylistId: data.id,
        });
      }
    });
  }

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
        />
      );
    }
  }
}

GoldifyPlaylist.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};

export default GoldifyPlaylist;
