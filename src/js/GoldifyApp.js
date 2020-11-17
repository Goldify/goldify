import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import GoldifyLandingPage from './landing/GoldifyLandingPage'
import GoldifyExecutePage from './execute/GoldifyExecutePage'
import logo from "../assets/goldify_logo.png";
import "../css/GoldifyApp.css";

class GoldifyApp extends Component {
  render() {
    return (
      <Router>
        <div className="GoldifyApp">
          <nav>
            <img src={logo} alt="Goldify Logo" className="GoldifyApp-logo" />
            <ul>
              <li><Link id="home-link" to={'/'} >Home</Link></li>
              <li><Link id="get-started-link" to={'/goldify'}>Get Started</Link></li>
            </ul>
          </nav>
          <header>
            <div className="headline">
              <div className="inner">
                <h1>Goldify</h1>
              </div>
            </div>
          </header>
          <Switch>
            <Route exact path='/' component={GoldifyLandingPage} />
            <Route path='/goldify' component={GoldifyExecutePage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default GoldifyApp;