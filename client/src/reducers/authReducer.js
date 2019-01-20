import * as actionType from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {},
  connections: [],
  pnd_connections: [],
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case actionType.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
      case actionType.SET_PND_CONNECTIONS:
        return {
            ...state,
            pnd_connections: action.payload
        }
      case actionType.SET_CONNECTIONS:
        return {
            ...state,
            connections: action.payload
        }
    default:
      return state;
    }
}
