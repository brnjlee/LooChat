import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authentication";
import openSocket from "socket.io-client";
import { api } from "./config/settings";

import Navbar from "./components/Navbar/Navbar";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";
import Dashboard from "./containers/Dashboard/Dashboard";
import VideoCall from "./containers/VideoCall/VideoCall";
import UserSearchContainer from "./containers/UserSearchContainer";
import Redirect from "./containers/Redirect";
import "./styles/styles.css";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  }
}

class App extends Component {
  constructor() {
    super();
    this.socket = openSocket(api);
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div id="master-wrapper">
            {/* <Navbar /> */}
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Redirect} />
            <Route
              path="/dashboard/:id"
              render={props => <Dashboard {...props} socket={this.socket} />}
            />
            <Route
              exact
              path="/videocall"
              render={props => <VideoCall {...props} socket={this.socket} />}
            />
            <Route
              exact
              path="/find"
              render={props => (
                <UserSearchContainer {...props} socket={this.socket} />
              )}
            />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
