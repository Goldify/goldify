import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../../css/TrackDataTable.css";
import { retrieveTopListeningDataAxios } from "../../utils/TopListeningDataUtils";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { blue, green } from "@material-ui/core/colors";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import BeenhereIcon from "@material-ui/icons/Beenhere";

class TopListeningData extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      topListeningData: null,
    };
  }

  componentDidMount() {
    if (this.props.retrievedTokenData.access_token != undefined) {
      this.retrieveTopListeningData(this.props.retrievedTokenData);
    }
  }

  async retrieveTopListeningData(retrievedTokenData) {
    await retrieveTopListeningDataAxios(retrievedTokenData).then((data) => {
      if (data === undefined || data.error) {
        replaceWindowURL("/");
      } else {
        this.setState({
          topListeningData: data,
        });
      }
    });
  }

  goldifyPlaylistContainsTrack(trackUri) {
    return this.props.goldifyUriList.includes(trackUri);
  }

  getTopListeningDataDiv() {
    return (
      <div className="track-data-table-container">
        <div className="track-data-table-header-container">
          <h1 className="track-data-table-header">Your Top Recent Hits</h1>
        </div>
        <table className="track-data-table">
          <thead className="track-data-thead">
            <tr className="track-data-tr">
              <th className="track-data-th"></th>
              <th className="track-data-th"></th>
              <th className="track-data-th">Title</th>
              <th className="track-data-th">Artist(s)</th>
              <th className="track-data-th">Album</th>
              <th className="track-data-th">Popularity</th>
            </tr>
          </thead>
          <tbody className="track-data-tbody">
            {this.state.topListeningData.items.map((listValue, index) => {
              return (
                <tr key={index} className="track-data-tr">
                  <td className="track-data-td">
                    {this.goldifyPlaylistContainsTrack(listValue.uri) ? (
                      <BeenhereIcon
                        style={{ color: blue[500] }}
                        fontSize="large"
                      />
                    ) : (
                      <AddCircleIcon
                        className="top-listens-add-track"
                        style={{ color: green[500] }}
                        fontSize="large"
                        onClick={() => {
                          this.props.addTrackHandler(listValue);
                        }}
                      />
                    )}
                  </td>
                  <td className="track-data-td">
                    <img alt="Album Art" src={listValue.album.images[0].url} />
                  </td>
                  <td className="track-data-td">{listValue.name}</td>
                  <td className="track-data-td">
                    {listValue.album.artists
                      .map((artist, index) => (
                        <span key={index}>{artist.name}</span>
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr])}
                  </td>
                  <td className="track-data-td">{listValue.album.name}</td>
                  <td className="track-data-td">{listValue.popularity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    if (this.state.topListeningData == null) {
      return <div />;
    } else {
      return this.getTopListeningDataDiv();
    }
  }
}

TopListeningData.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
  goldifyUriList: PropTypes.array.isRequired,
  addTrackHandler: PropTypes.func.isRequired,
};

export default TopListeningData;
