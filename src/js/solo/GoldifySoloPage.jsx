import React, { Component } from "react";
import _ from "lodash";
import "../../css/GoldifySoloPage.css";
import UserInfo from "./user-info/UserInfo";
import GoldifyPlaylist from "./goldify-playlist/GoldifyPlaylist";
import {
  retrieveAuthenticationCode,
  retrieveAuthorization,
  retrieveTokensAxios,
  replaceWindowURL,
  getLoadingPage,
} from "../utils/GoldifySoloUtils";
import { retrieveUserDataAxios } from "../utils/UserInfoUtils";

class GoldifySoloPage extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      retrievedTokenData: null,
      userData: null,
    };
  }

  /**
   * Authenticates the user, then retrieves data necessary for basic function
   */
  componentDidMount() {
    let code = retrieveAuthenticationCode();
    if (code == undefined || code == null) {
      retrieveAuthorization();
    } else {
      this.retrieveDataOnPageLoad(code);
    }
  }

  /**
   * Gets the user's token data, as well as the user's profile data
   * @param   {string} code Spotify's authorization code
   */
  async retrieveDataOnPageLoad(code) {
    await retrieveTokensAxios(code)
      .then((data) => {
        if (data === undefined || data.error) {
          replaceWindowURL("/");
        } else {
          this.setState({
            retrievedTokenData: data,
          });
          return data;
        }
      })
      .then((tokenData) => {
        if (!_.isEmpty(tokenData)) {
          retrieveUserDataAxios(tokenData).then((userData) => {
            if (userData === undefined || userData.error) {
              replaceWindowURL("/");
            } else {
              this.setState({
                userData: userData,
              });
            }
          });
        }
      });
  }

  /**
   * Displays the base goldifySolo page
   * @returns {HTMLElement} Div containing the User Info component and the Goldify Playlist component
   */
  getGoldifyPage() {
    return (
      <div className="goldify-page-container">
        <UserInfo userData={this.state.userData} />
        <div className="container">
          <GoldifyPlaylist
            retrievedTokenData={this.state.retrievedTokenData}
            userData={this.state.userData}
          />
        </div>
      </div>
    );
  }

  /**
   * Renders the loading page until base data is retrieved, then renders the goldify page
   * @returns {HTMLElement} Div of either the loading page or the goldify page
   */
  render() {
    if (this.state.retrievedTokenData == null || this.state.userData == null) {
      return getLoadingPage();
    } else {
      return this.getGoldifyPage();
    }
  }
}

export default GoldifySoloPage;
