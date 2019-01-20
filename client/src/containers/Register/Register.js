import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { registerUser } from '../../actions/authentication';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

class Register extends Component {
  constructor() {
    super();
    this.state = {
        name: '',
        email: '',
        username:'',
        password: '',
        password_confirm: '',
        errors: {}
    }
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated){
      this.props.history.push('/');
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
        name: this.state.name,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        password_confirm: this.state.password_confirm
    }
    this.props.registerUser(user, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated) {
      this.props.history.push('/')
    }
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  render() {
        const { errors } = this.state;
        return(
          <div>
          <div className="center-container">
              <h2 style={{marginBottom: '40px'}}>Sign Up</h2>
              <form id="inner" onSubmit={ this.handleSubmit }>
                  <div className="form-group">
                      <input
                      type="text"
                      placeholder="Name"
                      className={classnames('form-ctrl', {
                          'is-invalid': errors.name
                      })}
                      name="name"
                      onChange={ this.onInputChange }
                      value={ this.state.name }
                      />
                      {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                  </div>
                  <div className="form-group">
                      <input
                      type="email"
                      placeholder="Email"
                      className={classnames('form-ctrl', {
                          'is-invalid': errors.email
                      })}
                      name="email"
                      onChange={ this.onInputChange }
                      value={ this.state.email }
                      />
                      {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  </div>
                  <div className="form-group">
                      <input
                          type="text"
                          placeholder="Username"
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
                      <input
                      type="password"
                      placeholder="Confirm Password"
                      className={classnames('form-ctrl', {
                          'is-invalid': errors.password_confirm
                      })}
                      name="password_confirm"
                      onChange={ this.onInputChange }
                      value={ this.state.password_confirm }
                      />
                      {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
                  </div>
                  <div className="form-group">
                      <button type="submit" className="btn btn-ctrl">
                          REGISTER
                      </button>
                  </div>
                  <Link className="sign-link" to="/login">
                    Log In
                  </Link>
              </form>
          </div>
          </div>
        )
    }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps,{ registerUser })(withRouter(Register))
