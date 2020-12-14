import React, { Component } from "react";
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

class GoldifySoloPage extends Component {
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      retrievedTokenData: null,
    };
  }

  componentDidMount() {
    let code = retrieveAuthenticationCode();
    if (code == undefined || code == null) {
      retrieveAuthorization();
    } else {
      this.retrieveTokensOnPageLoad(code);
    }
  }

  async retrieveTokensOnPageLoad(code) {
    await retrieveTokensAxios(code).then((data) => {
      if (data === undefined || data.error) {
        replaceWindowURL("/");
      } else {
        this.setState({
          retrievedTokenData: data,
        });
      }
    });
  }

  getGoldifyPage() {
    return (
      <div className="goldify-page-container">
        <UserInfo retrievedTokenData={this.state.retrievedTokenData} />
        <div className="container">
          <GoldifyPlaylist retrievedTokenData={this.state.retrievedTokenData} />
        </div>
      </div>
    );
  }

  render() {
    if (this.state.retrievedTokenData === null) {
      return getLoadingPage();
    } else {
      return this.getGoldifyPage();
    }
  }
}

export default GoldifySoloPage;
