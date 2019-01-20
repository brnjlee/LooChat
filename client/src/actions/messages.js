import axios from 'axios';
import * as action from './types';
import { api } from '../config/settings';

export const sendMessage = (data, conversationId, userId, socket) => dispatch => {
  const message = {
    content: data,
    author: {
      _id: userId
    }
  }
  const payload = {
      conversationId,
      message
  };
  socket.emit('new message', payload);
  dispatch(addMessage(message));

  //save message to database for reloading
  axios.post(`${api}/api/messages/send_message/${conversationId}`, {
    content: data
  })
    .catch(err => {
      dispatch({
        type: action.GET_ERRORS,
        payload: err.response.data
      })
    })
};

export const addMessage = (message) => dispatch => {
  dispatch({
    type: action.SET_MESSAGE,
    payload: message
  })
}
