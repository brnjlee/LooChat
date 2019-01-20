import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './UserSearchContainer.css';
import { connect } from 'react-redux';
import {
    getUserResults
} from '../../actions/search';
import {
    addUser,
    confirmUser,
    getPendingConnections
} from '../../actions/authentication';

import UserCard from '../../components/UserCard';

class UserSearchContainer extends Component {
    constructor() {
        super();
        this.state = {
            input: ''
        }
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        this.props.getPendingConnections();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if(!nextProps.auth.isAuthenticated){
            this.props.history.push('/');
        }
    }

    handleChange = (e) => {
        this.setState({
            input: e.target.value
        }, () => {
            if(this.state.input && this.state.input.length > 0) {
                this.props.getUserResults(this.state.input);
            }
        })
    }
    
    render() {
        const results = {
            accepted: [],
            pending: [],
            requested: [],
            unaccepted: []
        };
        this.props.searchResults.userResults.forEach((user, i) => {
            if( user.acc_connections.includes(this.props.auth.user.username) ) {
                results.accepted.push(
                    <UserCard key={i} isRequested={false} isAccepted={true} isPending={false} user={user} addUser={() => {}} /> 
                ) 
            } else if(user.pnd_connections.includes(this.props.auth.user.username)) {
                results.pending.push(
                    <UserCard key={i} isRequested={true} isAccepted={false} isPending={false} user={user} addUser={() => {} } /> 
                )
            } else if(user.req_connections.includes(this.props.auth.user.username)) {
                results.requested.push(
                    <UserCard key={i} isRequested={false} isAccepted={false} isPending={true} user={user} addUser={() => {
                        this.props.confirmUser(user.username);
                        this.props.getUserResults(this.state.input)}
                    } /> 
                )
            } else {
                results.unaccepted.push(
                    <UserCard key={i} isRequested={false} isAccepted={false} isPending={false} user={user} addUser={() => {
                        this.props.addUser(user.username);
                        this.props.getUserResults(this.state.input)}
                    } />
                )
            }
        });
        const userResults = (
            <div>
                {results.requested}
                {results.accepted}
                {results.pending}
                {results.unaccepted}
            </div>
        );

        const pndConnections = this.props.auth.pnd_connections.map((user, i) => {
            return <UserCard key={i} isRequested={false} isAccepted={false} isPending={true} user={user} addUser={() => {
                this.props.confirmUser(user.username);
                this.props.getPendingConnections()}} 
                />
        })

        return(
            <div id="user-search-container">
                <div id="inner">
                    <div id="search-header">
                        <i className="material-icons search-icon">
                            search
                        </i>
                        <h1>Find</h1>
                    </div>
                    <input
                        type='text'
                        id="user-search"
                        placeholder="Search users"
                        onChange={this.handleChange}
                    />
                    <span id="result-header">Results</span>
                    <div id="result-container">
                        {this.props.searchResults.userResults.length > 0? userResults:
                        <span id="no-user-message">
                            No users found
                        </span>
                        }
                    </div>
                    <span id="result-header">Connection Requests</span>
                    <div id="result-container">
                        {this.props.auth.pnd_connections.length > 0? pndConnections :
                            <span id="no-user-message">
                            No requests
                        </span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

UserSearchContainer.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    searchResults: state.searchResults
})

export  default connect(
    mapStateToProps,
    {
        getUserResults,
        addUser,
        confirmUser,
        getPendingConnections
    }
)(UserSearchContainer)
