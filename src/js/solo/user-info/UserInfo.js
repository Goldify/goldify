import React, { Component } from "react";
import "../../../css/UserInfo.css";
import PropTypes from "prop-types";
import _ from "lodash";
import spotifyLogo from "../../../assets/spotify_logo.png";
import Avatar from "@material-ui/core/Avatar";

class UserInfo extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      userData: null,
    };
  }
  /**
   * Sets this components userData state once available
   */
  componentDidMount() {
    if (!_.isEmpty(this.props.userData)) {
      this.setUserData(this.props.userData);
    }
  }

  /**
   * Basic function that sets the userData state of this component
   * @param   {object} userData Object containing the user's profile data
   */
  async setUserData(userData) {
    this.setState({
      userData: userData,
    });
  }

  /**
   * Displays the user's profile data formatted in a single component
   * @returns {HTMLElement} Div containing the user's profile information
   */
  getUserInfoDiv() {
    return (
      <div className="card">
        <div className="user-image">
          <div>
            <a
              href={this.state.userData.external_urls.spotify}
              target="_blank"
              rel="noreferrer"
            >
              <Avatar
                alt="Profile Image"
                src={this.state.userData.images[0].url}
                className="user-image-avatar"
              />
            </a>
          </div>
        </div>
        <div className="user-names">
          <h1>{this.state.userData.display_name}</h1>
        </div>
        <div className="spotify-logo">
          <img src={spotifyLogo} alt="Spotify Logo" />
        </div>
      </div>
    );
  }

  /**
   * Displays the user's profile data once available
   * @returns {HTMLElement} An empty div or a div displaying the user's information
   */
  render() {
    if (this.state.userData == null) {
      return <div />;
    } else {
      return this.getUserInfoDiv();
    }
  }
}

UserInfo.propTypes = {
  userData: PropTypes.object.isRequired,
};

export default UserInfo;
