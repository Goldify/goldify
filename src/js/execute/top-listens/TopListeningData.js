import React, { Component } from "react";
import PropTypes from 'prop-types';
import "../../../css/TopListeningData.css";
import {
  retrieveTopListeningDataAxios
} from "../../utils/TopListeningDataUtils"
import {
  replaceWindowURL
} from "../../utils/GoldifyExecuteUtils"

class TopListeningData extends Component {
    
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      topListeningData: null
    };
  }

  componentDidMount() {
    if (this.props.retrievedTokenData.access_token != undefined) {
      this.retrieveTopListeningData(this.props.retrievedTokenData);
    }
  }

  async retrieveTopListeningData(retrievedTokenData) {
    await retrieveTopListeningDataAxios(retrievedTokenData)
      .then((data) => {
        if (data === undefined || data.error) {
          replaceWindowURL("/");
        } else {
          this.setState({
            topListeningData: data
          });
        }
      });
  }

  getTopListeningDataDiv() {
    return (
      <div className="container">
        <table className="top-listening-data-table">
          <thead className="top-listening-data-thead">
            <tr className="top-listening-data-tr">
              <th className="top-listening-data-table"></th>
              <th className="top-listening-data-table">Album</th>
              <th className="top-listening-data-table">Artist(s)</th>
              <th className="top-listening-data-table">Song Title</th>
              <th className="top-listening-data-table">Popularity</th>
            </tr>
          </thead>
          <tbody className="top-listening-data-tbody">
            {this.state.topListeningData.items.map(( listValue, index ) => {
              return (
                <tr key={index} className="top-listening-data-tr">
                  <td className="top-listening-data-td">
                    <img alt="Album Art" src={listValue.album.images[0].url} />
                  </td>
                  <td className="top-listening-data-td">{listValue.album.name}</td>
                  <td className="top-listening-data-td">
                    {
                      listValue.album.artists
                        .map(( artist, index ) => <span key={index}>{artist.name}</span>)
                        .reduce((prev, curr) => [prev, ', ', curr])
                    }
                  </td>
                  <td className="top-listening-data-td">{listValue.name}</td>
                  <td className="top-listening-data-td">{listValue.popularity}</td>
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
      return (<div />);
    } else {
      return this.getTopListeningDataDiv();
    }
  }

}

TopListeningData.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired
};

export default TopListeningData;