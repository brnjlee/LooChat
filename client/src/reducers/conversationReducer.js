import * as actions from "../actions/types";

const initialState = {
    // messageIsLoading: false,
    conversationIsLoading: false,
    otherUserId: null,
    conversations: [],
    conversation: {
        id:"",
        messages: [],
        title: ''
    },
    receivingCallRequest: false,
    videoInProgress: false,
    videoConversation: {
        from: {
            name: null,
            id: null,
            avatar: null,
        },
        conversationId: null,
    },
    refresh: false,
    newConversation: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        // case actions.SET_MESSAGE_LOADER:
        //     return {
        //         ...state,
        //         messageIsLoading: true
        //     }
        case actions.SET_CONVERSATION_LOADER:
            return {
                ...state,
                conversationIsLoading: true
            }
        case actions.SET_OTHER_USER_ID:
            return {
                ...state,
                otherUserId: action.payload
            }
        case actions.SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload
            }
        case actions.SET_CONVERSATION:
            return {
                ...state,
                conversation: {
                    id: action.payload.id,
                    messages:action.payload.messages,
                    title: action.payload.title
                },
                // messageIsLoading: false,
                conversationIsLoading: false,
                newConversation: false
            }
        case actions.SET_NEW_CONVERSATION:
            return {
                ...state,
                conversation: {
                    id: null,
                    messages:[],
                    title: action.payload.title
                },
                conversationIsLoading: false,
                newConversation: true
            }
        case actions.CREATE_NEW_CONVERSATION:
            return {
                ...state,
                conversation: {
                    id: action.payload,
                    messages: state.conversation.messages,
                    title: state.conversation.title
                },
                newConversation: false
            }
        case actions.SET_MESSAGE:
            return {
                ...state,
                conversation: {
                    id: state.conversation.id,
                    messages: [...state.conversation.messages, action.payload]
                }
            }
        case actions.SEND_VIDEO_CONNECTION:
            return {
                ...state,
                videoConversation: {
                    from: {
                        name: null,
                        id: null,
                        avatar: null,
                    },
                    conversationId: action.payload,
                },
                refresh: true,
            }
        case actions.RECEIVE_VIDEO_CONNECTION:
            return {
                ...state,
                receivingCallRequest: true,
                videoConversation: {
                    from: action.payload.user,
                    conversationId: action.payload.id,
                }
            }

        case actions.CONFIRM_VIDEO_CONNECTION:
            return {
                ...state,
                receivingCallRequest: false,
            }

        case actions.DECLINE_VIDEO_CONNECTION:
            return {
                ...state,
                receivingCallRequest: false,
            }

        default:
            return state;
    }
}
