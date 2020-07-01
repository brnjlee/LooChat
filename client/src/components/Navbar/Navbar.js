import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authentication";
import { withRouter } from "react-router-dom";
import {
  FiMessageSquare,
  FiSearch,
  FiLogOut,
  FiVideo,
  FiPlus
} from "react-icons/fi";
import { cx } from "classnames";

import "./Navbar.css";

class Navbar extends Component {
  constructor() {
    super();
    this.state = {};
  }

  onLogout = e => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  };

  onNav(page) {
    this.props.changePage(page);
  }

  render() {
    const {
      page,
      auth: { isAuthenticated }
    } = this.props;

    const isSelected = pageName => (pageName === page ? "selected" : null);

    return (
      isAuthenticated && (
        <div className="navbar">
          <div
            className={`nav-item ${isSelected("dashboard")}`}
            onClick={this.onNav.bind(this, "dashboard")}
          >
            <FiMessageSquare className="material-icons icon" />
          </div>
          <div
            className={`nav-item ${isSelected("search")}`}
            onClick={this.onNav.bind(this, "search")}
          >
            <FiSearch className="material-icons icon" />
          </div>
          <div
            className={`nav-item ${isSelected("add")}`}
            onClick={this.onNav.bind(this, "add")}
          >
            <FiPlus className="material-icons icon" />
          </div>
          <div
            className={`nav-item ${isSelected("call")}`}
            onClick={this.onNav.bind(this, "call")}
          >
            <FiVideo className="material-icons icon" />
          </div>
          <div
            className={`nav-item ${isSelected("user")}`}
            onClick={this.onLogout.bind(this)}
          >
            <FiLogOut className="material-icons icon" />
          </div>
        </div>
      )
    );
  }
}
Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
