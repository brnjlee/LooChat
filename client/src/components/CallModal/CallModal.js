import React from 'react';
import './CallModal.css';
import { Link } from 'react-router-dom';

const CallModal = props => {
    const show = {marginRight: 30};
    const hide = {marginRight: -300};
    return (
        <div id="call-modal" style={props.show? show : hide }>
            <div id="top-container">
                <img 
                    src={props.receivingCall.from.avatar} 
                    alt={props.receivingCall.from.name} 
                    title={props.receivingCall.from.name}
                    className="avatar"
                />
                <span id="name">{props.receivingCall.from.name}</span>
            </div>
            <div id="bottom-container">
                <Link to={{
                    pathname: '/videocall',
                    state: {
                        conversationId: props.receivingCall.conversationId,
                        otherUserId: null
                    }
                }}>
                    <div id="accept" onClick={props.accept}>
                        Accept
                    </div>
                </Link>
                <div id="decline" onClick={props.decline}>
                    Decline
                </div>
            </div>

        </div>
    )
}

export default CallModal;
