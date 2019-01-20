import axios from 'axios';
import * as actionType from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';
import { api } from '../config/settings';

export const registerUser = (user, history) => dispatch => {
    axios.post(`${api}/api/users/register`, user)
        .then(res => history.push('/login'))
        .catch(err => {
            dispatch({
                type: actionType.GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const loginUser = (user) => dispatch => {
    axios.post(`${api}/api/users/login`, user)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
            axios.get(`${api}/api/users/me`)
                .then(res => {
                    dispatch({
                        type: actionType.SET_CONNECTIONS,
                        payload: res.data.connections
                    })
                })
        })
        .catch(err => {
            dispatch({
                type: actionType.GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const getPendingConnections = () => dispatch => {
    axios.get(`${api}/api/users/get_pnd_connections`)
        .then(res => {
            dispatch({
                type: actionType.SET_PND_CONNECTIONS,
                payload: res.data
            })
        })
        .catch(err => {
        });
}

export const addUser = (username) => dispatch => {
    axios.post(`${api}/api/users/add_user/${username}`)
        .catch(err => {
        });
}

export const confirmUser = (username) => dispatch => {
    axios.post(`${api}/api/users/confirm_user/pull/${username}`)
        .catch(err => {
        });
}

export const getConnections = () => dispatch => {
    axios.get(`${api}/api/users/get_acc_connections`)
        .then(res => {
            dispatch({
                type: actionType.SET_CONNECTIONS,
                payload: res.data
            })
        })
        .catch(err => {
        });
}

export const setCurrentUser = decoded => {
    return {
        type: actionType.SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
}
