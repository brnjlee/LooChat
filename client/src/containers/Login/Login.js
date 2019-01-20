import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authentication';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      errors: {}
    }
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password
    }
    this.props.loginUser(user);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    if(nextProps.auth.isAuthenticated){
      this.props.history.push('/dashboard');
    }
  }


  render() {
        const {errors} = this.state;
        return(
        <div className="center-container">
            <h1 style={{marginBottom: '40px'}}>Log In</h1>
            <form id="inner" onSubmit={ this.handleSubmit }>
                <div className="form-group">
                    <input
                    type="username"
                    placeholder="username"
                    className={classnames('form-ctrl', {
                        'is-invalid': errors.username
                    })}
                    name="username"
                    onChange={ this.onInputChange }
                    value={ this.state.username }
                    />
                    {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
                </div>
                <div className="form-group">
                    <input
                    type="password"
                    placeholder="Password"
                    className={classnames('form-ctrl', {
                        'is-invalid': errors.password
                    })}
                    name="password"
                    onChange={ this.onInputChange }
                    value={ this.state.password }
                    />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn-ctrl"> 
                        LOG IN
                    </button>
                </div>
                <Link className="sign-link" to="/register">
                    Not registered?
                </Link>
            </form>
        </div>
        )
    }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)
