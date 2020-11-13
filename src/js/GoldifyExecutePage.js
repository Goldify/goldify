import React, { Component } from "react";
import "../css/GoldifyExecutePage.css";
import {
  retrieveAuthenticationCode,
  retrieveAuthorization,
  retrieveTokensAxios,
  retrieveUserDataAxios,
  replaceWindowURL
} from "../utils/GoldifyExecuteUtils"

class GoldifyExecutePage extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      authorizationCode: "",
      refreshToken: "",
      accessToken: "",
      userData: null,
      userDataString: ""
    };
  }

  componentDidMount() {
    let code = retrieveAuthenticationCode();
    if (code == undefined || code == null) {
      retrieveAuthorization();
    } else {
      this.retrieveDataOnPageLoad(code);
    }
  }

  async retrieveDataOnPageLoad(code) {
    await retrieveTokensAxios(code)
      .then((retrievedTokenData) => {
        if (retrievedTokenData === undefined || retrievedTokenData.error) {
          replaceWindowURL("/");
        } else {
          this.retrieveUserData(code, retrievedTokenData);
        }
      });
  }

  async retrieveUserData(code, retrievedTokenData) {
    await retrieveUserDataAxios(retrievedTokenData)
      .then((userData) => {
        if (userData === undefined || userData.error) {
          replaceWindowURL("/");
        } else {
          this.setStateTokensAndUserData(code, retrievedTokenData, userData);
        }
      });
  }

  setStateTokensAndUserData(code, retrievedTokenData, retrievedUserData) {
    this.setState({
      authorizationCode: code,
      refreshToken: retrievedTokenData.refresh_token,
      accessToken: retrievedTokenData.access_token,
      userData: retrievedUserData,
      userDataString: JSON.stringify(retrievedUserData)
    });
  }

  tokensAndOrDataAreInvalid() {
    return this.state.authorizationCode == null || this.state.authorizationCode == "" ||
      this.state.accessToken == null || this.state.accessToken == "" ||
      this.state.userData == undefined || this.state.userData == null;
  }

  getLoadingPage() {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    )
  }

  getUserDataPage() {
    return (
      <div className="goldify-page-container">
        <div className="card">
          <img src={this.state.userData.images[0].url} alt="Profile Image" />
          <h1>{this.state.userData.display_name}</h1>
          <p className="title">
            {this.state.userData.id}
          </p>
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
      </div>
    );
  }

  render() {
    if (this.tokensAndOrDataAreInvalid()) {
      return this.getLoadingPage();
    } else {
      return this.getUserDataPage();
    }
  }
}

export default GoldifyExecutePage;