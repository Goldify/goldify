import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../../css/TrackDataTable.css";
import { getPlaylistTracksById } from "../../utils/playlistTracks";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { GOLDIFY_PLAYLIST_NAME } from "../../utils/constants";

class GoldifyPlaylistData extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      goldifyPlaylistData: null,
    };
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
          this.setState({
            goldifyPlaylistData: data,
          });
        }
      }
    );
  }

  getGoldifyPlaylistDiv() {
    return (
      <div className="track-data-table-container">
        <div className="track-data-table-header-container">
          <h1 className="track-data-table-header">
            {`Your ${GOLDIFY_PLAYLIST_NAME} Playlist`}
          </h1>
        </div>
        <table className="track-data-table">
          <thead className="track-data-thead">
            <tr className="track-data-tr">
              <th className="track-data-th"></th>
              <th className="track-data-th">Title</th>
              <th className="track-data-th">Artist(s)</th>
              <th className="track-data-th">Album</th>
              <th className="track-data-th">Popularity</th>
            </tr>
          </thead>
          <tbody className="track-data-tbody">
            {this.state.goldifyPlaylistData.items.map((listValue, index) => {
              return (
                <tr key={index} className="track-data-tr">
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
                  <td className="track-data-td">
                    {listValue.track.popularity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
