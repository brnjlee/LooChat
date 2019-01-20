import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Redirect as Direct} from 'react-router-dom';
import { api } from '../../config/settings';

import {
	getConversations
} from '../../actions/conversations';

class Redirect extends Component {
    constructor() {
        super();
        this.state = {
        	redirect : false,
        	endpoint: ''
        }
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
    	axios.get(`${api}/api/messages/get_conversations`)
        .then(res => {
            console.log(res);
        	if(res.data.conversations.length === 0) {
        		this.setState({
        			redirect: true,
        			endpoint: '/dashboard/null'
        		});
        	} else {
        		this.setState({
	            	redirect: true,
	            	endpoint: `/dashboard/${res.data.conversations[0][2].endpointId}`
            	});
        	}
        })
        .catch(err => {
        })
    }

    render() {
       return (
       		<div>
       			{this.state.redirect && <Direct to={{
				    pathname: this.state.endpoint
				  }}/>}
       			
       		</div>
   		)
    }
}

Redirect.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
})

export default connect(
    mapStateToProps,
    {
    	getConversations
    }
)(Redirect)
