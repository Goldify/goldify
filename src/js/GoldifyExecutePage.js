import React, { Component } from 'react';
import "../css/GoldifyExecutePage.css";

const queryString = require("query-string");

var clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Your client id
var clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET; // Your secret
var redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

function useQuery() {
  return new URLSearchParams(window.location.search);
}

function retrieveAuthorization() {
  let spotifyApiURL =
    "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: clientId,
      scope: "user-read-private user-read-email",
      redirect_uri: redirectUri,
      state: generateRandomString(16)
    });
  window.location.replace(spotifyApiURL);
}

function loadHomePage() {
  window.location.replace("/");
}

class GoldifyExecutePage extends Component {
  
  constructor(props) {
    // Initialize mutable state
    super(props);
    this.state = {
      initFailed: false,
      authorizationCode: "",
      refreshToken: "",
      accessToken: "",
      userData: null,
      userDataString: ""
    };
  }

  componentDidMount() {
    let code = useQuery().get('code');
    if (code == undefined || code == null) {
      retrieveAuthorization();
    } else {
      this.retrieveTokens(code);
    }
  }

  retrieveTokens(code) {
    let apiTokenBody = new URLSearchParams();
    apiTokenBody.set("grant_type", "authorization_code");
    apiTokenBody.set("redirect_uri", redirectUri);
    apiTokenBody.set("code", code);
    let spotifyApiTokenURL = "https://accounts.spotify.com/api/token";
    fetch(spotifyApiTokenURL, {
      method: "POST",
      headers: {
        "Authorization": " Basic " + btoa(clientId + ":" + clientSecret)
      },
      body: apiTokenBody
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          loadHomePage();
        }
        return response.json();
      })
      .then((data) => {
        this.retrieveUserData(code, data);
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }

  retrieveUserData(code, data) {
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        "Authorization": "Bearer " + data.access_token
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          loadHomePage();
        }
        return response.json();
      })
      .then((retrievedUserData) => {
        this.setStateTokensAndUserData(code, data, retrievedUserData);
      })
      .catch(error => console.log(error));
  }

  setStateTokensAndUserData(code, data, retrievedUserData) {
    this.setState({
      authorizationCode: code,
      refreshToken: data.refresh_token,
      accessToken: data.access_token,
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