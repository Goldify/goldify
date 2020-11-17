import React, { Component } from "react";
import "../../css/GoldifyExecutePage.css";
import UserInfo from "./user-info/UserInfo";
import {
  retrieveAuthenticationCode,
  retrieveAuthorization,
  retrieveTokensAxios,
  replaceWindowURL,
  getLoadingPage
} from "../utils/GoldifyExecuteUtils"

class GoldifyExecutePage extends Component {

  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      retrievedTokenData: null
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
    await retrieveTokensAxios(code)
      .then((data) => {
        if (data === undefined || data.error) {
          replaceWindowURL("/");
        } else {
          this.setState({
            retrievedTokenData: data
          });
        }
      });
  }

  getGoldifyPage() {
    return (
      <div className="goldify-page-container">
        <UserInfo retrievedTokenData={this.state.retrievedTokenData} />
      </div>
    );
  }

  render() {
    if (this.state.retrievedTokenData == null) {
      return getLoadingPage();
    } else {
      return this.getGoldifyPage();
    }
  }
}

export default GoldifyExecutePage;