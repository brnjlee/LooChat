import axios from 'axios';
import * as action from './types';
import { api } from '../config/settings';

export const getConversations = (socket) => dispatch => {
    axios.get(`${api}/api/messages/get_conversations`)
        .then(res => {
            console.log(res);
            const conversations = res.data.conversations.map(conversation => {
                return conversation[0].conversationId
            });
            socket.emit('enter conversations', conversations);
            dispatch(setConversations(res));
        })
        .catch(err => {
            console.log('error');
            dispatch({
                type: action.GET_ERRORS,
                payload: err
            })
        })
}

export const getConversation = (id) => dispatch => {
    let getConversation = `${api}/api/messages/get_groupConversation/`;
    if(id[0] === '0') {
        getConversation = `${api}/api/messages/get_conversation/`;
    }
    let otherUserId = id.substring(1);
    dispatch({
        type: action.SET_OTHER_USER_ID,
        payload: otherUserId
    });
    dispatch({
        type: action.SET_CONVERSATION_LOADER
    });
    console.log(getConversation + otherUserId);
    axios.get(getConversation + otherUserId)
        .then(res => {
            dispatch(fetchConversation(res))
        })
        .catch(err => {
            console.log('error', err);
        })
}

export const fetchConversation = res => {
    if(res.data.conversationId) {
        const conversation = {
            id: res.data.conversationId,
            messages: res.data.conversation,
            title: res.data.title[0].name
        };
        return{
            type: action.SET_CONVERSATION,
            payload: conversation
        }
    } else {
        return{
            type: action.SET_NEW_CONVERSATION,
            payload: res.data
        }
    }
}

export const setConversations = res => {
    return {
        type: action.SET_CONVERSATIONS,
        payload: res.data.conversations
    }
}

export const newConversation = (socket, recipientId, content) => dispatch => {
    axios.post(`${api}/api/messages/new_conversation/${recipientId}`, {composedMessage: content})
        .then(res => {
            console.log(res);
            dispatch({
                type: action.CREATE_NEW_CONVERSATION,
                payload: res.data.conversationId
            });

            axios.get(`${api}/api/messages/get_conversations`)
                .then(res => {
                    const conversations = res.data.conversations.map(conversation => {
                        return conversation[0].conversationId
                    });
                    socket.emit('enter conversations', conversations);
                    dispatch(setConversations(res));
                })
                .catch(err => {
                    dispatch({
                        type: action.GET_ERRORS,
                        payload: err
                    })
                })
        })
        .catch(err => {
            dispatch({
                type: action.GET_ERRORS,
                payload: err
            });
        })
}

export const sendVideoConversation = (socket, conversation) => dispatch => {
    socket.emit('request call', conversation);
    dispatch({
        type: action.SEND_VIDEO_CONNECTION,
        payload: conversation.id
    })
}

export const receiveVideoConversation = (conversation) => dispatch => {
    dispatch({
        type: action.RECEIVE_VIDEO_CONNECTION,
        payload: conversation
    })
};

export const confirmVideoConversation = (socket, conversationId) => dispatch => {
    socket.emit('accepted call', (conversationId));

    dispatch({
        type: action.CONFIRM_VIDEO_CONNECTION
    })
};

export const declineVideoConversation = (socket, conversationId) => dispatch => {
    socket.emit('declined call', (conversationId));

    dispatch({
        type: action.DECLINE_VIDEO_CONNECTION
    })
};

export const stopVideoConversation = (socket, conversationId, history) => dispatch => {
    socket.emit('stop call', (conversationId));
    history.goBack();
}

