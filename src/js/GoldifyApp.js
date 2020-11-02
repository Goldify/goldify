import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import GoldifyLandingPage from './GoldifyLandingPage'
import GoldifyExecutePage from './GoldifyExecutePage'
import logo from "../assets/goldify_logo.png";
import "../css/GoldifyApp.css";

class GoldifyApp extends Component {
  render() {
    return (
      <Router>
        <div className="GoldifyApp">
          <nav>
            <img src={logo} alt="Chicago Bears Logo" className="GoldifyApp-logo" />
            <ul>
              <li><Link to={'/'}> Home </Link></li>
              <li><Link to={'/goldify'}> Get Started </Link></li>
            </ul>
          </nav>
          <header>
            <div className="headline">
              <div className="inner">
                <h1>Goldify</h1>
              </div>
            </div>
          </header>
          <body>
            <Switch>
              <Route exact path='/' component={GoldifyLandingPage} />
              <Route path='/goldify' component={GoldifyExecutePage} />
            </Switch>
          </body>
        </div>
      </Router>
    );
  }
}

export default GoldifyApp;
