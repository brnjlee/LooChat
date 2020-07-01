import React from "react";
import "./CallModal.css";
import { Link } from "react-router-dom";
import cx from "classnames";
import { FiX, FiPhone } from "react-icons/fi";

const CallModal = props => {
  const modalClass = cx("call-modal-overlay", {
    show: props.show
  });

  return (
    <div className={modalClass}>
      <div className="call-modal">
        <img
          src={props.receivingCall.from.avatar}
          alt={props.receivingCall.from.name}
          title={props.receivingCall.from.name}
          className="call-modal-avatar"
        />
        <div className="cercle one"></div>

        <span id="name">{props.receivingCall.from.name}</span>
        <div id="bottom-container">
          <div className="call-button decline" onClick={props.decline}>
            <FiX className="fix-icon" />
          </div>
          <Link
            to={{
              pathname: "/videocall",
              state: {
                conversationId: props.receivingCall.conversationId,
                otherUserId: null
              }
            }}
          >
            <div className="call-button accept" onClick={props.accept}>
              <FiPhone className="phone-icon" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
