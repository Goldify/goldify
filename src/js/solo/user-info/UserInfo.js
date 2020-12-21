import React, { Component } from "react";
import "../../../css/UserInfo.css";
import PropTypes from "prop-types";
import _ from "lodash";

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
        <img src={this.state.userData.images[0].url} alt="Profile Image" />
        <h1>{this.state.userData.display_name}</h1>
        <p className="title">{this.state.userData.id}</p>
        <p>
          <b>Email:</b> {this.state.userData.email}
        </p>
        <p>
          <b>Total Followers:</b> {this.state.userData.followers.total}
        </p>
        <p>
          <b>Country:</b> {this.state.userData.country}
        </p>
        <p>
          <a
            href={this.state.userData.external_urls.spotify}
            target="_blank"
            rel="noreferrer"
          >
            <button className="view-profile">View Profile</button>
          </a>
        </p>
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
