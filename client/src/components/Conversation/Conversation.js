import React from "react";
import PropTypes from "prop-types";
import "./Conversation.css";
import { Link } from "react-router-dom";
import cx from "classnames";

const Conversation = props => {
  const conversationClassname = cx("conversation", {
    searchConversation: props.searchConvo,
    selected: props.selected
  });

  return (
    <div
      className={conversationClassname}
      onClick={props.handleClick}
      onMouseDown={props.onMouseDown}
    >
      <Link
        to={{ pathname: `/dashboard/${props.id}` }}
        id="conversation-link"
        style={{ textDecoration: "none" }}
      >
        <img
          src={props.title.avatar}
          alt={props.title.name}
          title={props.title.name}
          className="conversation-avatar"
        />
        <div className="details" style={{ display: "flex" }}>
          <span id="title">{props.title.name}</span>
          <span id="content">{props.content}</span>
        </div>
      </Link>
    </div>
  );
};

Conversation.propTypes = {
  title: PropTypes.object.isRequired
};

export default Conversation;
