import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../../css/TrackDataTable.css";
import TopListeningData from "../top-listens/TopListeningData";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { red, amber } from "@material-ui/core/colors";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Button from "@material-ui/core/Button";
import {
  replacePlaylistTracks,
  getPlaylistTracksById,
} from "../../utils/playlistTracks";
import { GOLDIFY_PLAYLIST_NAME } from "../../utils/constants";

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
  }

  componentDidMount() {
    if (this.props.retrievedTokenData.access_token != undefined) {
      this.retrieveGoldifyPlaylistData(
        this.props.retrievedTokenData,
        this.props.goldifyPlaylistId
      );
    }
  }

  async retrieveGoldifyPlaylistData(retrievedTokenData, goldifyPlaylistId) {
    await getPlaylistTracksById(retrievedTokenData, goldifyPlaylistId).then(
      (data) => {
        if (data === undefined || data.error) {
          replaceWindowURL("/");
        } else {
          this.setInitialGoldifyPlaylistData(data);
        }
      }
    );
  }

  setInitialGoldifyPlaylistData(playlistTrackData) {
    this.setSavedGoldifyPlaylistData(playlistTrackData);
    var uriList = [];
    for (var i = 0; i < playlistTrackData.items.length; ++i) {
      var track = playlistTrackData.items[i].track;
      uriList.push(track.uri);
    }
    this.goldifyPlaylistTrackUriList = uriList;
    this.setState({
      goldifyPlaylistData: playlistTrackData,
      playlistDirty: false,
    });
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
    replacePlaylistTracks(
      this.props.retrievedTokenData,
      this.props.goldifyPlaylistId,
      this.goldifyPlaylistTrackUriList
    );
    this.setSavedGoldifyPlaylistData(this.state.goldifyPlaylistData);
    this.setState({
      playlistDirty: false,
    });
  }

  cancelUpdatesToGoldifyPlaylist() {
    var uriList = [];
    for (var i = 0; i < this.savedGoldifyPlaylistData.items.length; ++i) {
      var currentTrack = this.savedGoldifyPlaylistData.items[i].track;
      uriList.push(currentTrack.uri);
    }
    this.goldifyPlaylistTrackUriList = uriList;
    this.setState({
      goldifyPlaylistData: this.savedGoldifyPlaylistData,
      playlistDirty: false,
    });
  }

  addTrackFromTopListensData(trackData) {
    if (!this.goldifyPlaylistTrackUriList.includes(trackData.uri)) {
      this.addGoldifyPlaylistTrackUri(trackData.uri);
      let currentPlaylistData = this.state.goldifyPlaylistData;
      currentPlaylistData.items.push({
        track: trackData,
      });
      this.setState({
        goldifyPlaylistData: currentPlaylistData,
        playlistDirty: true,
      });
    } else {
      throw Error("Track already exists in playlist: " + trackData.id);
    }
  }

  removeGoldifyTrack(track) {
    let currentPlaylistData = this.state.goldifyPlaylistData;
    let index = -1;
    for (var i = 0; i < currentPlaylistData.items.length; ++i) {
      var currentTrack = currentPlaylistData.items[i].track;
      if (currentTrack.id === track.id) {
        index = i;
      }
    }
    if (index !== -1) {
      this.removeGoldifyPlaylistTrackUri(track.uri);
      currentPlaylistData.items.splice(index, 1);
      this.setState({
        goldifyPlaylistData: currentPlaylistData,
        playlistDirty: true,
      });
    } else {
      throw Error("Track not found: " + track.id);
    }
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
          <table className="track-data-table">
            <thead className="track-data-thead">
              <tr className="track-data-tr">
                <th className="track-data-th track-data-action-icon"></th>
                <th className="track-data-th track-data-album-cover"></th>
                <th className="track-data-th">Title</th>
                <th className="track-data-th">Artist(s)</th>
                <th className="track-data-th">Album</th>
              </tr>
            </thead>
            <tbody className="track-data-tbody">
              {this.state.goldifyPlaylistData.items.map((listValue, index) => {
                return (
                  <tr key={index} className="track-data-tr">
                    <td className="track-data-td">
                      <RemoveCircleIcon
                        className="goldify-playlist-remove-button"
                        style={{ color: red[500] }}
                        fontSize="large"
                        onClick={() => {
                          this.removeGoldifyTrack(listValue.track);
                        }}
                      />
                    </td>
                    <td className="track-data-td">
                      <img
                        alt="Album Art"
                        src={listValue.track.album.images[0].url}
                      />
                    </td>
                    <td className="track-data-td">{listValue.track.name}</td>
                    <td className="track-data-td">
                      {listValue.track.album.artists
                        .map((artist, index) => (
                          <span key={index}>{artist.name}</span>
                        ))
                        .reduce((prev, curr) => [prev, ", ", curr])}
                    </td>
                    <td className="track-data-td">
                      {listValue.track.album.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TopListeningData
          retrievedTokenData={this.props.retrievedTokenData}
          goldifyUriList={this.goldifyPlaylistTrackUriList}
          addTrackHandler={this.addTrackFromTopListensData}
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
