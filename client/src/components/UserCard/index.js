import React from "react";

import { Link } from "react-router-dom";

import "./UserCard.css";

const UserCard = props => {
  let userAction = null;

  if (props.isRequested) {
    userAction = (
      <div className="user-button">
        <i className="material-icons button-icon">done</i>
        <span>Sent</span>
      </div>
    );
  } else if (props.isAccepted) {
    userAction = (
      <div
        className="user-button message"
        onClick={() => props.addUser(`0${props.user._id}`)}
      >
        <Link to={{ pathname: `/dashboard/0${props.user._id}` }}>
          <i
            className="material-icons button-icon"
            style={{ fontSize: 10, paddingRight: 5 }}
          >
            radio_button_unchecked
          </i>
          <span>Message</span>
        </Link>
      </div>
    );
  } else if (props.isPending) {
    userAction = userAction = (
      <div className="user-button" onClick={props.addUser}>
        <i className="material-icons button-icon">add</i>
        <span>Accept</span>
      </div>
    );
  } else {
    userAction = userAction = (
      <div className="user-button" onClick={props.addUser}>
        <i className="material-icons button-icon">add</i>
        <span>Add</span>
      </div>
    );
  }
  return (
    <div id="user-card">
      <img
        src={props.user.avatar}
        alt={props.user.name}
        title={props.user.name}
        id="user-avatar"
      />
      <div className="details">
        <span id="title">{props.user.name}</span>
        <span id="username">{props.user.username}</span>
      </div>

      {userAction}
    </div>
  );
};

export default UserCard;
