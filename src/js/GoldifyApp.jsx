import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import GoldifyLandingPage from "./landing/GoldifyLandingPage";
import GoldifySoloPage from "./solo/GoldifySoloPage";
import logo from "../assets/goldify_logo.png";
import spotifyFullLogoBlack from "../assets/spotify_full_logo_black.png";
import { spotifyHomePageUrl } from "./utils/constants";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { HOME_PAGE_PATH, SOLO_PAGE_PATH } from "./utils/constants";
import "../css/GoldifyApp.css";

const GoldifyTabs = withStyles({
  indicator: {
    backgroundColor: "#FCC201",
  },
})(Tabs);

class GoldifyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.getSelectedTab(window.location.href),
    };
  }

  /**
   * Returns the tab index based on which page has been selected
   * @returns {Integer} The selected tab index
   */
  getSelectedTab(currentUrl) {
    return currentUrl.indexOf(SOLO_PAGE_PATH) > -1 ? 1 : 0;
  }

  /**
   * Displays the nav bar with links to all pages, which will redirect
   * the user to each Goldify page
   * @returns {HTMLElement} The Nav bar on each page, with links to redirect
   */
  render() {
    return (
      <Router>
        <div className="goldify-app">
          <div className="goldify-header">
            <div className="goldify-logo">
              <a href={HOME_PAGE_PATH}>
                <img src={logo} alt="Goldify Logo" />
              </a>
            </div>
            <div className="goldify-title">
              <h1>Goldify</h1>
            </div>
            <div className="goldify-tabs-bar">
              <Paper square className="goldify-tabs-paper">
                <GoldifyTabs
                  value={this.state.selectedTab}
                  variant="fullWidth"
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="icon label tabs example"
                  className="goldify-tabs"
                >
                  <Tab
                    className="goldify-tab"
                    label="Home"
                    href={HOME_PAGE_PATH}
                  />
                  <Tab
                    className="goldify-tab"
                    label="Solo"
                    href={SOLO_PAGE_PATH}
                  />
                </GoldifyTabs>
              </Paper>
            </div>
          </div>
          <Switch>
            <Route exact path={HOME_PAGE_PATH} component={GoldifyLandingPage} />
            <Route path={SOLO_PAGE_PATH} component={GoldifySoloPage} />
          </Switch>
          <footer>
            <p>
              Goldify is powered by
              <a href={spotifyHomePageUrl} target="_blank" rel="noreferrer">
                <img
                  src={spotifyFullLogoBlack}
                  className="goldify-footer-img"
                />
              </a>
            </p>
          </footer>
        </div>
      </Router>
    );
  }
}

export default GoldifyApp;
