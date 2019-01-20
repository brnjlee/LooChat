import React from 'react';
import './Message.css';
import PropTypes from 'prop-types';

const Message = props => {
    return(
        <div>
            <div id={props.fromUser? "message-user" : "message-received"}>
              <div id="message-content">{props.children}</div>
            </div>
        </div>
    );
}

Message.propTypes = {
  fromUser: PropTypes.bool.isRequired,
};

export default Message;
