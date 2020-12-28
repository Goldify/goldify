import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../../css/TrackDataTable.css";
import TopListeningData from "../top-listens/TopListeningData";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { amber } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import {
  replacePlaylistTracks,
  getPlaylistTracksById,
} from "../../utils/playlistTracks";
import { GOLDIFY_PLAYLIST_NAME } from "../../utils/constants";
import arrayMove from "array-move";
import { SortableList } from "../../utils/GoldifyPlaylistDataElements";

class GoldifyPlaylistData extends Component {
  savedGoldifyPlaylistData = {};
  goldifyPlaylistTrackUriList = [];

  constructor(props) {
    super(props);
    this.state = {
      goldifyPlaylistData: null,
      playlistDirty: false,
    };

    this.retrieveGoldifyPlaylistData = this.retrieveGoldifyPlaylistData.bind(
      this
    );
    this.updateGoldifyPlaylist = this.updateGoldifyPlaylist.bind(this);
    this.cancelUpdatesToGoldifyPlaylist = this.cancelUpdatesToGoldifyPlaylist.bind(
      this
    );
    this.addTrackFromTopListensData = this.addTrackFromTopListensData.bind(
      this
    );
    this.removeGoldifyTrack = this.removeGoldifyTrack.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  /**
   * Retrieves the tracks of the user's playlist once the user's token data is available
   */
  componentDidMount() {
    if (this.props.retrievedTokenData.access_token != undefined) {
      this.retrieveGoldifyPlaylistData(
        this.props.retrievedTokenData,
        this.props.goldifyPlaylistId
      );
    }
  }

  /**
   * Gets the tracks in the user's goldify playlist
   * @param   {object} retrievedTokenData Object containing the user's access token
   * @param   {string} goldifyPlaylistId ID of the user's goldify playlist
   */
  async retrieveGoldifyPlaylistData(retrievedTokenData, goldifyPlaylistId) {
    await getPlaylistTracksById(retrievedTokenData, goldifyPlaylistId).then(
      (data) => {
        if (data === undefined || data.error) {
          replaceWindowURL("/");
        } else {
          this.setInitialGoldifyPlaylistData(data.items);
        }
      }
    );
  }

  setURIListFromPlaylistData(playlistData) {
    var uriList = [];
    for (var i = 0; i < playlistData.length; ++i) {
      var track = playlistData[i].track;
      uriList.push(track.uri);
    }
    this.goldifyPlaylistTrackUriList = uriList;
  }

  setInitialGoldifyPlaylistData(playlistTrackData) {
    this.setURIListFromPlaylistData(playlistTrackData);
    this.setState({
      goldifyPlaylistData: playlistTrackData,
      playlistDirty: false,
    });
    this.setSavedGoldifyPlaylistData(playlistTrackData);
  }

  setSavedGoldifyPlaylistData = (data) => {
    this.savedGoldifyPlaylistData = JSON.parse(JSON.stringify(data));
  };

  addGoldifyPlaylistTrackUri = (trackUri) => {
    this.goldifyPlaylistTrackUriList.push(trackUri);
  };

  removeGoldifyPlaylistTrackUri = (trackUri) => {
    var index = this.goldifyPlaylistTrackUriList.indexOf(trackUri);
    if (index !== -1) {
      this.goldifyPlaylistTrackUriList.splice(index, 1);
    } else {
      throw Error("Unable to remove track: " + trackUri);
    }
  };

  updateGoldifyPlaylist() {
    this.setURIListFromPlaylistData(this.state.goldifyPlaylistData);
    replacePlaylistTracks(
      this.props.retrievedTokenData,
      this.props.goldifyPlaylistId,
      this.goldifyPlaylistTrackUriList
    );
    this.setState({
      playlistDirty: false,
    });
    this.setSavedGoldifyPlaylistData(this.state.goldifyPlaylistData);
  }

  cancelUpdatesToGoldifyPlaylist() {
    this.setURIListFromPlaylistData(this.savedGoldifyPlaylistData);
    this.setState({
      goldifyPlaylistData: this.savedGoldifyPlaylistData,
      playlistDirty: false,
    });
    this.setSavedGoldifyPlaylistData(this.savedGoldifyPlaylistData);
  }

  addTrackFromTopListensData(trackData) {
    if (!this.goldifyPlaylistTrackUriList.includes(trackData.uri)) {
      this.addGoldifyPlaylistTrackUri(trackData.uri);
      let currentPlaylistData = this.state.goldifyPlaylistData;
      currentPlaylistData.push({
        track: trackData,
      });
      this.setState({
        goldifyPlaylistData: currentPlaylistData,
        playlistDirty: true,
      });
    }
  }

  removeGoldifyTrack(track) {
    let currentPlaylistData = this.state.goldifyPlaylistData;
    let index = -1;
    for (var i = 0; i < currentPlaylistData.length; ++i) {
      var currentTrack = currentPlaylistData[i].track;
      if (currentTrack.id === track.id) {
        index = i;
      }
    }
    if (index !== -1) {
      this.removeGoldifyPlaylistTrackUri(track.uri);
      currentPlaylistData.splice(index, 1);
      this.setState({
        goldifyPlaylistData: currentPlaylistData,
        playlistDirty: true,
      });
    } else {
      throw Error("Track not found: " + track.id);
    }
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      goldifyPlaylistData: arrayMove(
        this.state.goldifyPlaylistData,
        oldIndex,
        newIndex
      ),
      playlistDirty: true,
    });
  }

  getGoldifyPlaylistDiv() {
    return (
      <div>
        <div className="goldify-update-buttons">
          {this.state.playlistDirty ? (
            <div>
              <Button
                className="goldify-playlist-save-button"
                variant="contained"
                color="primary"
                style={{ background: amber[600] }}
                onClick={() => {
                  this.updateGoldifyPlaylist();
                }}
              >
                Save Goldify Playlist
              </Button>
              <Button
                className="goldify-playlist-cancel-button"
                variant="contained"
                color="primary"
                style={{ background: amber[600] }}
                onClick={() => {
                  this.cancelUpdatesToGoldifyPlaylist();
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="track-data-table-container">
          <div className="track-data-table-header-container">
            <h1 className="track-data-table-header">
              {`Your ${GOLDIFY_PLAYLIST_NAME} Playlist`}
            </h1>
          </div>
          <div className="track-data-table-inner-container">
            <table className="track-data-table">
              <thead className="track-data-thead">
                <tr className="track-data-tr">
                  <th className="track-data-th"></th>
                  <th className="track-data-th track-data-action-icon"></th>
                  <th className="track-data-th track-data-album-cover">
                    Album
                  </th>
                  <th className="track-data-th">Title</th>
                  <th className="track-data-th">Artist(s)</th>
                </tr>
              </thead>
              <SortableList
                goldifyPlaylistData={this.state.goldifyPlaylistData}
                removeTrackContainerHandler={this.removeGoldifyTrack}
                onSortEnd={this.onSortEnd}
                useDragHandle
              />
            </table>
          </div>
        </div>
        <TopListeningData
          retrievedTokenData={this.props.retrievedTokenData}
          goldifyUriList={this.goldifyPlaylistTrackUriList}
          addTrackHandler={this.addTrackFromTopListensData}
          playlistDirty={this.state.playlistDirty}
        />
      </div>
    );
  }

  render() {
    if (this.state.goldifyPlaylistData == null) {
      return <div />;
    } else {
      return this.getGoldifyPlaylistDiv();
    }
  }
}

GoldifyPlaylistData.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
  goldifyPlaylistId: PropTypes.string.isRequired,
};

export default GoldifyPlaylistData;
