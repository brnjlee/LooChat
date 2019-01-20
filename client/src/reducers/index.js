import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import conversationReducer from './conversationReducer';
import searchReducer from './searchReducer';

export default combineReducers({
	errors: errorReducer,
	auth: authReducer,
	conversations: conversationReducer,
	searchResults: searchReducer
});
