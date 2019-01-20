import React from 'react';
import './ConversationWindow.css';

const ConversationWindow = props => {
    return (
        <div id="ConversationWindow">
            {props.children}
        </div>
    );
};

ConversationWindow.propTypes = {
};

export default ConversationWindow;
