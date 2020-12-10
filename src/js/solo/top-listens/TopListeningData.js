import React, { Component } from "react";
import PropTypes from "prop-types";
import "../../../css/TrackDataTable.css";
import { retrieveTopListeningDataAxios } from "../../utils/TopListeningDataUtils";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";

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
};

export default TopListeningData;
