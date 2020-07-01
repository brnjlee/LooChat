import React from "react";
import "./NoMessages.css";
import conversations from "../../assets/conversations.svg";

const NoMessages = props => {
  return (
    <div className="no-messages-container">
      <img src={conversations} alt="conversations" />
      <div className="header">No Messages, yet</div>
      <div className="content">
        No messages found in your inbox. Search for a user in the left panel and
        start a conversation. To add new friends, navigate to the search tab and
        send a request to a friend
      </div>
    </div>
  );
};

export default NoMessages;
