import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import "../../../css/TrackDataTable.css";
import { retrieveTopListeningDataAxios } from "../../utils/TopListeningDataUtils";
import {
  replaceWindowURL,
  getSpotifyRedirectURL,
} from "../../utils/GoldifySoloUtils";
import { blue, green } from "@material-ui/core/colors";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import {
  shortTermTracksRecommended,
  mediumTermTracksRecommended,
  longTermTracksRecommended,
  RECENT_TAB_VALUE,
  RECURRING_TAB_VALUE,
  EVERLASTING_TAB_VALUE,
  RECENTLY_REMOVED_TAB_VALUE,
  HOME_PAGE_PATH,
} from "../../utils/constants";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

class TopListeningData extends Component {
  newlyCreatedPlaylist = this.props.newlyCreatedPlaylist;

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      selectedTerm: 0,
      topListeningData: null,
      shortTermListeningData: null,
      mediumTermListeningData: null,
      longTermListeningData: null,
    };
    this.updateTopListeningDataTerm = this.updateTopListeningDataTerm.bind(
      this
    );
  }

  /**
   * Retrieves the user's top listening data once retrievedTokenData is available
   */
  componentDidMount() {
    if (this.props.retrievedTokenData.access_token !== undefined) {
      this.retrieveTopListeningData(this.props.retrievedTokenData);
    }
  }

  /**
   * Will retrieve the user's top listening data and which data is visible
   * @param  {object} retrievedTokenData User data containing an access_token
   * Defaults to displaying shortTermListeningData
   */
  async retrieveTopListeningData(retrievedTokenData) {
    await retrieveTopListeningDataAxios(retrievedTokenData).then((data) => {
      if (data === undefined || data.error) {
        replaceWindowURL(HOME_PAGE_PATH);
      } else {
        this.setState({
          topListeningData: data.short_term,
          shortTermListeningData: data.short_term,
          mediumTermListeningData: data.medium_term,
          longTermListeningData: data.long_term,
        });
      }
    });
  }

  /**
   * Checks to see if the selected track is already a part of your goldify playlist
   * @param  {string} trackUri Uri of the selected track
   * @returns {boolean} whether or not the track is in the current playlist
   */
  goldifyPlaylistContainsTrack(trackUri) {
    return this.props.goldifyUriList.includes(trackUri);
  }

  /**
   * Changes which TopListeningData is visible and sets states accordingly
   * @param  {object} event The OnChange event that triggered this call
   * @param  {number} value The value of the tab selected
   * @throws {Error} If the event was not defined
   */
  updateTopListeningDataTerm(event) {
    if (event === undefined) {
      throw Error("Event cannot be undefined");
    }
    let newValue = event.target.value;
    let newListeningData;
    switch (newValue) {
      case RECENT_TAB_VALUE:
        newListeningData = this.state.shortTermListeningData;
        break;
      case RECURRING_TAB_VALUE:
        newListeningData = this.state.mediumTermListeningData;
        break;
      case EVERLASTING_TAB_VALUE:
        newListeningData = this.state.longTermListeningData;
        break;
      case RECENTLY_REMOVED_TAB_VALUE:
        newListeningData = this.props.getRemovedTrackData();
        break;
    }
    this.setState({
      selectedTerm: newValue,
      topListeningData: newListeningData,
    });
  }

  /**
   * Auto-fills a playlist with a few tracks from the user's top listening data
   * This will use the addTrackHandler passed in to add the tracks to
   * the user's goldify playlist
   */
  autoFillGoldifyPlaylist() {
    for (var stTrack = 0; stTrack < shortTermTracksRecommended; stTrack++) {
      const currentTrack = this.state.shortTermListeningData?.items[stTrack];
      if (!_.isEmpty(currentTrack)) {
        this.props.addTrackHandler(currentTrack);
      }
    }
    for (var mtTrack = 0; mtTrack < mediumTermTracksRecommended; mtTrack++) {
      const currentTrack = this.state.mediumTermListeningData?.items[mtTrack];
      if (!_.isEmpty(currentTrack)) {
        this.props.addTrackHandler(currentTrack);
      }
    }
    for (var ltTrack = 0; ltTrack < longTermTracksRecommended; ltTrack++) {
      const currentTrack = this.state.longTermListeningData?.items[ltTrack];
      if (!_.isEmpty(currentTrack)) {
        this.props.addTrackHandler(currentTrack);
      }
    }
    this.props.onAutoFillCompleteHandler();
  }

  getTopListeningDataItemDiv(listValue, index) {
    return (
      <tr key={index} className="track-data-tr">
        <td className="track-data-td track-data-action-icon">
          {this.goldifyPlaylistContainsTrack(listValue.uri) ? (
            <BeenhereIcon style={{ color: blue[500] }} fontSize="large" />
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
        <td className="track-data-td track-data-album-cover">
          <a
            href={getSpotifyRedirectURL("album", listValue.album.id)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt={listValue.album.name}
              src={listValue.album.images[0].url}
            />
          </a>
        </td>
        <td className="track-data-td">
          <a
            href={getSpotifyRedirectURL("track", listValue.id)}
            target="_blank"
            rel="noreferrer"
          >
            {listValue.name}
          </a>
        </td>
        <td className="track-data-td">
          {listValue.album.artists
            .map((artist, index) => (
              <a
                key={index}
                href={getSpotifyRedirectURL("artist", artist.id)}
                target="_blank"
                rel="noreferrer"
              >
                {artist.name}
              </a>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
        </td>
      </tr>
    );
  }

  /**
   * Displays the top listening data set in the props
   * Will also call the props.addTrackHandler to add songs to the user's goldify playlist
   * @returns {HTMLElement} A div containing the retrieved/visible topListeningData
   */
  getTopListeningDataDiv() {
    return (
      <div className="track-data-table-container top-listens-table-container">
        <div className="track-data-table-header-container">
          <h1 className="track-data-table-header">Your Top Hits</h1>
          <FormControl
            variant="outlined"
            className="track-data-table-tab-panel"
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Time Range
            </InputLabel>
            <Select
              value={this.state.selectedTerm}
              onChange={this.updateTopListeningDataTerm}
              label="Time Range"
            >
              <MenuItem value={RECENT_TAB_VALUE}>Latest</MenuItem>
              <MenuItem value={RECURRING_TAB_VALUE}>Recap</MenuItem>
              <MenuItem value={EVERLASTING_TAB_VALUE}>All-Time</MenuItem>
              <MenuItem value={RECENTLY_REMOVED_TAB_VALUE}>
                Recently Removed
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="track-data-table-outer-container">
          <div className="track-data-table-inner-container">
            <table className="track-data-table">
              <thead className="track-data-thead">
                <tr className="track-data-tr">
                  <th className="track-data-th"></th>
                  <th className="track-data-th">Album</th>
                  <th className="track-data-th">Title</th>
                  <th className="track-data-th">Artist(s)</th>
                </tr>
              </thead>
              <tbody className="track-data-tbody">
                {this.state.selectedTerm !== RECENTLY_REMOVED_TAB_VALUE &&
                  this.state.topListeningData.items.map((listValue, index) => {
                    return this.getTopListeningDataItemDiv(listValue, index);
                  })}
                {this.state.selectedTerm === RECENTLY_REMOVED_TAB_VALUE &&
                  this.props
                    .getRemovedTrackData()
                    .items.map((listValue, index) => {
                      return this.getTopListeningDataItemDiv(listValue, index);
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders which div is available depending on state.topListeningData
   * Will also auto-fill recommendations to an empty goldify playlist
   * @returns {HTMLElement} Empty div or div containing top listening data
   */
  render() {
    if (this.state.topListeningData === null) {
      return <div />;
    } else {
      if (
        _.isArray(this.props.goldifyUriList) &&
        _.isEmpty(this.props.goldifyUriList) &&
        this.newlyCreatedPlaylist
      ) {
        this.newlyCreatedPlaylist = false;
        this.autoFillGoldifyPlaylist();
      }
      return this.getTopListeningDataDiv();
    }
  }
}

TopListeningData.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
  goldifyUriList: PropTypes.array.isRequired,
  addTrackHandler: PropTypes.func.isRequired,
  playlistDirty: PropTypes.bool.isRequired,
  newlyCreatedPlaylist: PropTypes.bool.isRequired,
  onAutoFillCompleteHandler: PropTypes.func.isRequired,
  getRemovedTrackData: PropTypes.func.isRequired,
};

export default TopListeningData;
