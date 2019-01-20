import axios from 'axios';
import * as action from './types';
import { api } from '../config/settings';

export const getUserResults = (input) => dispatch => {
    axios.get(`${api}/api/users/get_user/${input}`)
        .then((res) => {

            dispatch({
                type: action.SET_USER_RESULTS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log(err)
        });
}; 
