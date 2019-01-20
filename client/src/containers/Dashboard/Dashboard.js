import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';
import { connect } from 'react-redux';
import {
    getConversation,
    getConversations,
    newConversation,
    sendVideoConversation,
    receiveVideoConversation,
    confirmVideoConversation,
    declineVideoConversation
} from '../../actions/conversations';
import { getConnections } from "../../actions/authentication";
import { sendMessage, addMessage } from '../../actions/messages';

import ConversationWindow from '../../components/ConversationWindow/ConversationWindow';
import Conversation from '../../components/Conversation/Conversation';
import Input from '../../components/Input/Input';
import Message from '../../components/Message/Message';
import CallModal from '../../components/CallModal/CallModal';
import {Link} from "react-router-dom";
import { FiVideo } from "react-icons/fi";


class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            errors: {},
            conversation: "",
            conversations: [],
            showConnectionList: false,
            selectedUsers:[],
            hasMedia: false,
            otherUserId: null,
            input: '',
            userResults: []
        }
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        this.props.getConversations(this.props.socket);
        this.props.getConversation(this.props.match.params.id);
        this.props.getConnections();

        this.receiveMessage();
        this.receiveRequestedVideoCall();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if(!nextProps.auth.isAuthenticated){
            this.props.history.push('/login');
        }
    }

    componentDidUpdate() {
        if(this.messagesEnd){
            this.scrollToBottom();
        }
    }
    /*---------------SOCKET METHODS-----------------*/

    receiveMessage = () => {
        this.props.socket.on('new message', payload => {
            if(payload.conversationId === this.props.conversations.conversation.id) {
                console.log('recieved message');
                this.props.addMessage(payload.message);
            }
        })
    };

    receiveRequestedVideoCall = () => {
        this.props.socket.on('request call', conversation => {
            console.log(`recieving call from ${conversation.user.name}`);
            this.props.receiveVideoConversation(conversation);
        })
    };

    /*----------------------------------------------*/


    sendHandler = (message) => {
        if (this.props.conversations.newConversation) {
            this.props.newConversation(this.props.socket, this.props.conversations.otherUserId, message);
        }
        this.props.sendMessage(message, this.props.conversations.conversation.id, this.props.auth.user.id, this.props.socket);
    }

    requestVideoCall = () => {
        const conversation = {
            id: this.props.conversations.conversation.id,
            user: this.props.auth.user
        };
        this.props.sendVideoConversation(this.props.socket, conversation);

    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    searchUsers = (e) => {
        this.setState({
            input: e.target.value
        }, () => {
            if(this.state.input && this.state.input.length > 1) {
                const regex = new RegExp(`^${this.state.input}?[^s]+`, 'i');
                this.setState({
                    userResults: this.props.auth.connections.filter(connection => regex.test(connection.name))
                })
            }
        })
    }



    selectUser = (id) => {
        this.setState({ selectedUsers:[...this.state.selectedUsers, id ]})
    }


    render() {
        const conversations = this.props.conversations.conversations.map((conversation, i) => {
            return (
                <Conversation id={conversation[2].endpointId} key={i} title={conversation[1].title[0]} searchConvo={false}
                              content={conversation[0].content} handleClick={() => {this.props.getConversation(conversation[2].endpointId)} }
                />
            )
        });
        const conversation = this.props.conversations.conversation.messages.map((message, i) => {
            return (
                <Message key={i} fromUser={message.author._id === this.props.auth.user.id}>{message.content}</Message>
            )
        });

        const userResults = this.state.userResults.map((user,i) => {
            return (
                <Conversation id={`0${user._id}`} key={i} title={user} searchConvo={true} onMouseDown={(e) => e.preventDefault()}
                             handleClick={() => {this.props.getConversation(`0${user._id}`)} }
                />
            )
        });

        return(
            <div id="dashboard">
                <ConversationWindow>
                    <div id='header'>
                        <span id='header-span-messages'>
                            Messages
                        </span>
                    </div>
                    <input
                        ref={(input) => {this.input = input}}
                        type='text'
                        id="user-search"
                        placeholder="Search users"
                        onChange={this.searchUsers}
                        value={this.state.input}
                        onBlur={() =>
                            this.setState({
                                input: '',
                                userResults: []
                            })}
                    />
                    <div id='ConversationList'>
                        {userResults.length > 0? userResults : conversations}
                    </div>
                </ConversationWindow>

                <div id="message-window">
                    <div id="header">
                        <span id='header-span-conversation'>
                            {this.props.conversations.conversation.title}
                        </span>
                    </div>
                    {this.props.conversations.conversationIsLoading?
                        <div id='loadingContainer'>
                            <div className="loader" />
                        </div>
                        :
                        <div id='messageContainer'>
                            {conversation}
                            {this.props.conversations.messageIsLoading && <Message fromUser={true}>•••</Message>}
                            <div style={{ float:"left", clear: "both" }}
                                 ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </div>
                    }

                    <div id="inputContainer">
                        <Input onSend={this.sendHandler} />
                    </div>
                </div>
                <Link
                    to={{
                        pathname: '/videocall',
                        state: {
                            conversationId: this.props.conversations.conversation.id,
                            otherUserId: this.props.conversations.otherUserId
                        }
                    }}
                >
                    <FiVideo className="material-icons icon" id="video-icon" onClick={this.requestVideoCall}/>

                </Link>
                {/*<Route path="/dashboard/:id" render={(props) => <ConversationContainer {...props} socket={this.props.socket} />}/>*/}
                <CallModal
                    show={this.props.conversations.receivingCallRequest}
                    receivingCall={this.props.conversations.videoConversation}
                    accept={() => this.props.confirmVideoConversation(this.props.socket, this.props.conversations.videoConversation.conversationId)}
                    decline={()=> this.props.declineVideoConversation(this.props.socket, this.props.conversations.videoConversation.conversationId)}
                />
            </div>
        )
    }
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
    conversations: state.conversations,
    conversation: state.conversation
})

export  default connect(
    mapStateToProps,
    {
        getConversation,
        getConversations,
        sendMessage,
        addMessage,
        newConversation,
        getConnections,
        sendVideoConversation,
        receiveVideoConversation,
        confirmVideoConversation,
        declineVideoConversation
    }
)(Dashboard)
