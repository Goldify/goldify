import React, { Component } from "react";
import "../../css/GoldifyLandingPage.css";

class GoldifyLandingPage extends Component {
  /**
   * Renders the initial div when a user arrives at the site
   * @returns {HTMLElement} A div instructing the user on how to get started
   */
  render() {
    return (
      <div>
        <h1 className="landingHeader">Welcome to Goldify!</h1>
        <p>
          To get started, click &quot;Solo&quot; in the top right of the page!
        </p>
      </div>
    );
  }
}

export default GoldifyLandingPage;
