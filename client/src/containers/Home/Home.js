import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Home extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        } else {
        	this.props.history.push('/dashboard')
        }
    }

    render() {
        return(
            <div>
            </div>
        )
    }
}

Home.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
})

export  default connect(
    mapStateToProps,
    {
    }
)(Home)