import React from 'react';

import './UserCard.css';

const UserCard = props => {
    let userAction = null;

    if(props.isRequested) {
        userAction = (
            <div className="user-button sent">
                <i className="material-icons button-icon">
                    done
                </i>
                <span>Sent</span>
            </div>
        );
    } else if(props.isAccepted) {
        userAction = (
            <div className="user-button message" onClick={props.addUser}>
                <i className="material-icons button-icon" style={{fontSize: 10, paddingRight: 5}}>
                    radio_button_unchecked
                </i>
                <span>Message</span>
            </div>
        );
    } else if(props.isPending) {
        userAction = userAction = (
            <div className="user-button add" onClick={props.addUser}>
                <i className="material-icons button-icon">
                    add
                </i>
                <span>Confirm</span>
            </div>
        );
    } else {
        userAction = userAction = (
            <div className="user-button add" onClick={props.addUser}>
                <i className="material-icons button-icon">
                    add
                </i>
                <span>Add</span>
            </div>
        );
    }
    return (
        <div id="user-card">
            <img src={props.user.avatar} alt={props.user.name} title={props.user.name}
                 id="user-avatar"
            />
            <div id="user-details">
                <span id="user-name">{props.user.name}</span>
                <span id="user-username">{props.user.username}</span>
            </div>
        
            {userAction}
        </div>
    )
}

export default UserCard;
