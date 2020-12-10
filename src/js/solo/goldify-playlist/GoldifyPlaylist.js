import React, { Component } from "react";
import PropTypes from "prop-types";
import GoldifyPlaylistData from "./GoldifyPlaylistData";
import { findExistingGoldifyPlaylistByName } from "../../utils/playlist";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";

const GOLDIFY_PLAYLIST_NAME = "Goldify";

class GoldifyPlaylist extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      goldifyPlaylist: null,
      goldifyPlaylistId: "",
    };
  }

  componentDidMount() {
    if (this.props.retrievedTokenData.access_token != undefined) {
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
          "Unable to find Goldify playlist. Please make sure you have a " +
            'Spotify playlist with the name "Goldify" created under your Spotify account.'
        );
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
    if (this.state.goldifyPlaylist == null) {
      return <div />;
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
};

export default GoldifyPlaylist;
