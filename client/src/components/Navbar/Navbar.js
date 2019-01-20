import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authentication';
import { withRouter } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiLogOut } from "react-icons/fi";

import './Navbar.css'

class Navbar extends Component {

    constructor() {
        super();
        this.state = {
            expanded: false
        }
    }

    onLogout = (e) => {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
    }

    render() {
        const {isAuthenticated} = this.props.auth;

        return (
          <div>
              {isAuthenticated && 
              <nav className={this.state.expanded? "navbar navbar-active": "navbar"}>
                  <div id="navbar-nav">
                      <div className="nav-item">
                          <div className={this.state.expanded? "hamburger hamburger-active": "hamburger"}
                               onClick={() => this.setState({expanded: !this.state.expanded})}
                          >
                              <span id="top"></span>
                              <span id="middle"></span>
                              <span id="bottom"></span>
                          </div>
                      </div>
                      <Link className="nav-item nav-body" to="/dashboard">
                          <FiMessageSquare className="material-icons icon" />
                          <span id="option-text">Messages</span>
                      </Link>
                      <Link className="nav-item nav-body" to="/find">
                          <FiSearch className="material-icons icon" />
                          <span id="option-text">Find</span>
                      </Link>
                      <div className="nav-item nav-body" style={{flex: 1, alignItems: 'flex-end'}} onClick={this.onLogout.bind(this)}>
                          <FiLogOut className="material-icons icon" style={{paddingBottom: 15}} />
                          <span id="option-text">Log Out</span>
                      </div>
                  </div>
              </nav>
              }
              
          </div>
        )
    }
}
Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(withRouter(Navbar));
