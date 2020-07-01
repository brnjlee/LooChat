import * as actions from "../actions/types";

const initialState = {
  userResults: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actions.SET_USER_RESULTS:
      return {
        ...state,
        userResults: action.payload
      };
    default:
      return state;
  }
}
