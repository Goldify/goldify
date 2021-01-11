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
import { GOLDIFY_PLAYLIST_NAME } from "../utils/constants";
import { retrieveUserDataAxios } from "../utils/UserInfoUtils";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

class GoldifySoloPage extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      retrievedTokenData: null,
      userData: null,
      notificationOpen: false,
    };
    this.autoFillCompleted = this.autoFillCompleted.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
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

  autoFillCompleted() {
    this.setState({
      notificationOpen: true,
    });
  }

  handleCloseNotification(event, reason) {
    if (reason !== "clickaway") {
      this.setState({
        notificationOpen: false,
      });
    }
  }

  /**
   * Displays the base goldifySolo page
   * @returns {HTMLElement} Div containing the User Info component and the Goldify Playlist component
   */
  getGoldifyPage() {
    return (
      <div className="goldify-page-container">
        <UserInfo userData={this.state.userData} />
        <Snackbar
          open={this.state.notificationOpen}
          autoHideDuration={6000}
          onClose={this.handleCloseNotification}
          className="notification-snack-bar"
        >
          <Alert
            onClose={this.handleCloseNotification}
            severity="info"
            elevation={6}
            variant="filled"
          >
            We&apos;ve added a few of your top hits to your new&nbsp;
            {GOLDIFY_PLAYLIST_NAME} playlist!
          </Alert>
        </Snackbar>
        <div className="container">
          <GoldifyPlaylist
            retrievedTokenData={this.state.retrievedTokenData}
            userData={this.state.userData}
            autoFillCompletedHandler={this.autoFillCompleted}
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
