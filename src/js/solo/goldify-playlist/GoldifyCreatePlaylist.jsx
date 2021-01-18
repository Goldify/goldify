import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  createGoldifyPlaylist,
  uploadPlaylistImage,
} from "../../utils/playlist";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { goldifyBase64 } from "../../../assets/goldifyBase64String";
import {
  GOLDIFY_PLAYLIST_NAME,
  GOLDIFY_PLAYLIST_DESCRIPTION,
  spotifyHomePageUrl,
} from "../../utils/constants";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckIcon from "@material-ui/icons/Check";
import Fab from "@material-ui/core/Fab";
import "../../../css/GoldifyCreatePlaylist.css";
import spotifyLogo from "../../../assets/spotify_logo.png";
import goldifyLogo from "../../../assets/goldify_logo.png";

class GoldifyCreatePlaylist extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      loading: false,
      success: false,
      playlistCreated: false,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.createNewGoldifyPlaylist = this.createNewGoldifyPlaylist.bind(this);
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
    )
      .then((data) => {
        if (_.isEmpty(data) || data.error) {
          alert(`Unable to create your ${GOLDIFY_PLAYLIST_NAME} playlist.`);
          replaceWindowURL("/");
        } else {
          this.handlePlaylistCreated(data);
          return data.id;
        }
      })
      .then((playlistId) => {
        if (!_.isEmpty(playlistId)) {
          uploadPlaylistImage(retrievedTokenData, playlistId, goldifyBase64);
        }
      });
  }

  /**
   * Calls the async function to create the Goldify playlist
   */
  createNewGoldifyPlaylistAction() {
    this.createNewGoldifyPlaylist(
      this.props.retrievedTokenData,
      this.props.userData.id
    );
  }

  /**
   * Sets the state to loading, but no success. This way
   * the loading animation displays until the playlist is created
   */
  handleButtonClick() {
    if (!this.state.loading) {
      this.setState({
        loading: true,
        success: false,
      });
      this.createNewGoldifyPlaylistAction();
    }
  }

  /**
   * Called after the playlist creation has completed
   * @param  {object} data Playlist data retrieved after creation
   * Then performs a loading and checkmark notification before
   * loading the Goldify Solo page
   */
  handlePlaylistCreated(data) {
    window.setTimeout(() => {
      this.setState({
        loading: false,
        success: true,
      });
      window.setTimeout(() => {
        this.props.playlistUpdater(data);
      }, 1500);
    }, 2000);
  }

  /**
   * Shows text telling the user that their playlist is being created
   * @returns {HTMLElement} Basic div with an h3 header
   */
  createPlaylistDiv() {
    return (
      <div className="create-playlist-wrapper">
        <h1 className="create-playlist-header">Welcome to Goldify Solo!</h1>
        <div className="create-playlist-logo-container">
          <img
            className="create-playlist-goldify-logo"
            src={goldifyLogo}
            alt="Goldify Logo"
          />
          X
          <a href={spotifyHomePageUrl} target="_blank" rel="noreferrer">
            <img
              className="create-playlist-spotify-logo"
              src={spotifyLogo}
              alt="Spotify Logo"
            />
          </a>
        </div>
        <p className="create-playlist-body">
          It looks like you don&apos;t have a Goldify Playlist yet. No worries,
          we got you! Click the button below to create your Goldify Playlist and
          build your very own golden playlist.
        </p>
        <div>
          {this.state.success ? (
            <Fab
              aria-label="save"
              color="primary"
              style={{ background: green[500] }}
            >
              <CheckIcon />
            </Fab>
          ) : this.state.loading ? (
            <CircularProgress size={56} color="primary" />
          ) : (
            <Button
              className="create-playlist-button"
              variant="contained"
              color="primary"
              disabled={this.state.loading}
              onClick={this.handleButtonClick}
            >
              Create Goldify Playlist
            </Button>
          )}
        </div>
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
