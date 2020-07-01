import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";
import { connect } from "react-redux";
import {
  getConversation,
  getConversations,
  newConversation,
  sendVideoConversation,
  receiveVideoConversation,
  confirmVideoConversation,
  declineVideoConversation
} from "../../actions/conversations";
import { getConnections } from "../../actions/authentication";
import { sendMessage, addMessage } from "../../actions/messages";
import { notify } from "../../MediaHandler";

import ConversationList from "../../components/ConversationList/ConversationList";
import Input from "../../components/Input/Input";
import Message from "../../components/Message/Message";
import CallModal from "../../components/CallModal/CallModal";
import { Link } from "react-router-dom";
import { FiVideo } from "react-icons/fi";
import NoMessages from "../../components/NoMessages/NoMessages";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      conversation: "",
      conversations: [],
      showConnectionList: false,
      selectedUsers: [],
      hasMedia: false,
      otherUserId: null,
      input: "",
      userResults: [],
      page: "dashboard"
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.getConversations(this.props.socket);
    this.props.getConversation(this.props.match.params.id);
    this.props.getConnections();

    this.requestNotificationPermission();
    this.receiveMessage();
    this.receiveRequestedVideoCall();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  componentDidUpdate() {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }
  /*---------------SOCKET METHODS-----------------*/

  receiveMessage = () => {
    this.props.socket.on("new message", payload => {
      if (payload.conversationId === this.props.conversations.conversation.id) {
        console.log("recieved message");
        this.props.addMessage(payload.message);
      }
    });
  };

  receiveRequestedVideoCall = () => {
    this.props.socket.on("request call", conversation => {
      const message = `${conversation.user.name} is calling you`;
      notify(message, conversation.user.avatar);
      this.props.receiveVideoConversation(conversation);
    });
  };

  /*----------------------------------------------*/

  requestNotificationPermission = () => {
    if (!Notification) {
      alert(
        "Desktop notifications not available in your browser. Try Chromium."
      );
      return;
    }

    if (Notification.permission !== "granted") Notification.requestPermission();
  };

  sendHandler = message => {
    if (this.props.conversations.newConversation) {
      this.props.newConversation(
        this.props.socket,
        this.props.conversations.otherUserId,
        message
      );
    }
    this.props.sendMessage(
      message,
      this.props.conversations.conversation.id,
      this.props.auth.user.id,
      this.props.socket
    );
  };

  requestVideoCall = () => {
    const conversation = {
      id: this.props.conversations.conversation.id,
      user: this.props.auth.user
    };
    this.props.sendVideoConversation(this.props.socket, conversation);
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  selectUser = id => {
    this.setState({ selectedUsers: [...this.state.selectedUsers, id] });
  };

  render() {
    const conversation = this.props.conversations.conversation.messages.map(
      (message, i) => {
        return (
          <Message
            key={i}
            fromUser={message.author._id === this.props.auth.user.id}
          >
            {message.content}
          </Message>
        );
      }
    );

    return (
      <div id="dashboard">
        <ConversationList
          selectedConversation={this.props.conversations.conversation}
          conversations={this.props.conversations.conversations}
          connections={this.props.auth.connections}
          getConversation={conversationId =>
            this.props.getConversation(conversationId)
          }
          auth={this.props.auth}
        />

        <div id="message-window">
          {this.props.match.params.id === "null" ? (
            <NoMessages />
          ) : (
            <React.Fragment>
              <div id="conversation-header">
                <img
                  src={this.props.conversations.conversation.avatar}
                  alt={this.props.conversations.conversation.title}
                  title={this.props.conversations.conversation.title}
                  className="conversation-avatar"
                />
                <div className="conversation-details">
                  <span id="conversation-title">
                    {this.props.conversations.conversation.title}
                  </span>
                  <span id="conversation-username">
                    {this.props.conversations.conversation.username}
                  </span>
                </div>
                <Link
                  className="icon-button"
                  to={{
                    pathname: "/videocall",
                    state: {
                      conversationId: this.props.conversations.conversation.id,
                      otherUserId: this.props.conversations.otherUserId
                    }
                  }}
                >
                  <FiVideo id="video-icon" onClick={this.requestVideoCall} />
                </Link>
              </div>
              {this.props.conversations.conversationIsLoading ? (
                <div id="loadingContainer">
                  <div className="loader" />
                </div>
              ) : (
                <div id="messageContainer">
                  {conversation}
                  {this.props.conversations.messageIsLoading && (
                    <Message fromUser={true}>•••</Message>
                  )}
                  <div
                    style={{ float: "left", clear: "both" }}
                    ref={el => {
                      this.messagesEnd = el;
                    }}
                  ></div>
                </div>
              )}

              <div id="inputContainer">
                <Input onSend={this.sendHandler} />
              </div>
            </React.Fragment>
          )}
        </div>
        {/*<Route path="/dashboard/:id" render={(props) => <ConversationContainer {...props} socket={this.props.socket} />}/>*/}
        <CallModal
          show={this.props.conversations.receivingCallRequest}
          receivingCall={this.props.conversations.videoConversation}
          accept={() =>
            this.props.confirmVideoConversation(
              this.props.socket,
              this.props.conversations.videoConversation.conversationId
            )
          }
          decline={() =>
            this.props.declineVideoConversation(
              this.props.socket,
              this.props.conversations.videoConversation.conversationId
            )
          }
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  conversations: state.conversations,
  conversation: state.conversation
});

export default connect(
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
)(Dashboard);
