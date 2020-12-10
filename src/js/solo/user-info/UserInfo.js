import React, { Component } from "react";
import "../../../css/UserInfo.css";
import PropTypes from "prop-types";
import { replaceWindowURL } from "../../utils/GoldifySoloUtils";
import { retrieveUserDataAxios } from "../../utils/UserInfoUtils";

class UserInfo extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      userData: null,
    };
  }

  componentDidMount() {
    if (this.props.retrievedTokenData.access_token != undefined) {
      this.retrieveUserData(this.props.retrievedTokenData);
    }
  }

  async retrieveUserData(retrievedTokenData) {
    await retrieveUserDataAxios(retrievedTokenData).then((data) => {
      if (data === undefined || data.error) {
        replaceWindowURL("/");
      } else {
        this.setState({
          userData: data,
        });
      }
    });
  }

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
            <button>View Profile</button>
          </a>
        </p>
      </div>
    );
  }

  render() {
    if (this.state.userData == null) {
      return <div />;
    } else {
      return this.getUserInfoDiv();
    }
  }
}

UserInfo.propTypes = {
  retrievedTokenData: PropTypes.object.isRequired,
};

export default UserInfo;
