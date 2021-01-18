import React, { Component } from "react";
import "../../css/GoldifyLandingPage.css";
import spotifyLogo from "../../assets/spotify_logo.png";
import goldifyLogo from "../../assets/goldify_logo.png";
import goldenVinyl from "../../assets/golden_vinyl.jpg";
import { spotifyHomePageUrl } from "../utils/constants";
import MobileFriendlyIcon from "@material-ui/icons/MobileFriendly";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import FastForwardIcon from "@material-ui/icons/FastForward";
import { grey } from "@material-ui/core/colors";

class GoldifyLandingPage extends Component {
  /**
   * Renders the initial div when a user arrives at the site
   * @returns {HTMLElement} A div instructing the user on how to get started
   */
  render() {
    return (
      <div className="landing-wrapper">
        <div className="landing-top-wrapper">
          <h1 className="landing-header">Welcome to Goldify!</h1>
          <div className="landing-logo-container">
            <img
              className="landing-goldify-logo"
              src={goldifyLogo}
              alt="Goldify Logo"
            />
            X
            <a href={spotifyHomePageUrl} target="_blank" rel="noreferrer">
              <img
                className="landing-spotify-logo"
                src={spotifyLogo}
                alt="Spotify Logo"
              />
            </a>
          </div>
          <p className="landing-body">
            Goldify is an application built to help you easily design your
            golden Spotify playlist. Built using Spotify&apos;s APIs, we provide
            you with an easy-to-use interface which presents you with all your
            top hits to build your personal playlist from. Within minutes, you
            will have a Spotify playlist that is molded exactly to your musical
            taste. We&apos;re excited for you to be here and can&apos;t wait for
            you to enjoy your golden tracks!
          </p>
          <div className="landing-feature-icons">
            <div className="landing-feature-icon">
              <MobileFriendlyIcon style={{ fontSize: 40, color: grey[900] }} />
              <br />
              <h4>Mobile Friendly</h4>
            </div>
            <div className="landing-feature-icon">
              <VerifiedUserIcon style={{ fontSize: 40, color: grey[900] }} />
              <br />
              <h4>Clean User Interface</h4>
            </div>
            <div className="landing-feature-icon">
              <FastForwardIcon style={{ fontSize: 40, color: grey[900] }} />
              <br />
              <h4>Instant Updates</h4>
            </div>
          </div>
          <div className="landing-golden-vinyl">
            <img src={goldenVinyl} alt="Golden Vinyl" />
          </div>
        </div>
        <div className="landing-bottom-wrapper">
          <h2 className="landing-header">Question Time!</h2>
          <div className="landing-split-body">
            <h3>How do I get started?</h3>
            <p>
              Great question! At the top of this page, you will see the tabs
              named &quot;Home&quot; and &quot;Solo&quot;. You will want to
              click the &quot;Solo&quot; tab, and you&apos;ll be on your way to
              building musical magic!
            </p>
          </div>
          <div className="landing-split-body">
            <h3>Is there a limit to how often I can use Goldify Solo?</h3>
            <p>
              Not at all! Stop on by anytime you like, we love the company. In
              fact, we encourage you come back at least once a month to build on
              top of your already amazing Goldify playlist.
            </p>
          </div>
          <div className="landing-split-body">
            <h3>Can I come back later to update the playlist?</h3>
            <p>
              Of course! If you have visited this page before and created your
              masterpiece of a playlist, just simply click the &quot;Solo&quot;
              tab above and you&apos;ll be presented with your up-to-date Top
              Hits as well as your up-to-date Goldify playlist! Plus,
              you&apos;ll get to see all the updates to the application by the
              Goldify team. Pretty neat!
            </p>
          </div>
          <div className="landing-split-body">
            <h3>Can I modify the Goldify Playlist after it&apos;s created?</h3>
            <p>
              The only detail about the Goldify playlist that needs to be
              maintained is the title (&quot;Goldify&quot;). So long as this is
              the name of your playlist, you can go wild with the description,
              cover image, and even contents of the playlist! You could even
              make the cover image a picture of a pizza, and make the
              description &quot;Wow, I really love pizza, and I really love
              music!&quot;, and we would respect and adore you for that.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default GoldifyLandingPage;
