import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VideoCall.css';
import MediaHandler from "../../MediaHandler";
import Peer from 'simple-peer';

import { connect } from 'react-redux';
import {
    stopVideoConversation
} from '../../actions/conversations';

class VideoCall extends Component {
    constructor() {
        super();
        this.state = {
            errors: {},
            hasMedia: false,
            otherUserId: null,
            muted: false,
            requestInProgress: false,
        }
        this.MediaHandler = new MediaHandler();
        this.peers = {};
        this.stream = null;
        this.setupMedia();
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        if(this.props.location.state.otherUserId) {
            this.setState({requestInProgress: true})
        }
        this.receiveSignal();
        this.acceptedCall();
        this.declinedCall();
        this.stoppedCall();
    }

    setupMedia = () => {
        this.MediaHandler.getPermissions()
            .then((stream) => {
                this.stream = stream;
                this.setState({
                    hasMedia: true
                });
                if(this.myVideo !== null) {
                    try {
                        this.myVideo.srcObject = stream;
                    } catch(e) {
                        this.myVideo.src = URL.createObjectURL(stream);
                    }
                    this.myVideo.muted = true;
                    this.myVideo.autoplay = true;
                }
            })
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.auth.isAuthenticated){
            this.props.history.push('/login');
        }
    }

    componentWillUnmount() {
        this.removeSignalListener();
    }

    /*---------------SOCKET METHODS-----------------*/

    receiveSignal = () => {
        this.props.socket.on('client-signal', signal => {
            console.log('okay i got the signal');
            if(signal.conversation === this.props.location.state.conversationId){
                console.log(this.peers);
                let peer = this.peers[signal.userId];
                if (peer === undefined) {
                    peer = this.startPeer(signal.userId, false);
                    console.log(this.peers);
                }
                peer.signal(signal.data);
                this.peers[signal.userId] = peer;
            }
        })
    };

    acceptedCall = () => {
        this.props.socket.on('accepted call', () => {
            this.setState({requestInProgress: false});
            console.log(`start call with ${this.props.location.state.otherUserId}`);
            if(this.props.location.state.otherUserId !== null) {
                this.peers[this.props.location.state.otherUserId] = this.startPeer(this.props.location.state.otherUserId, true);
            }
        });
    };

    declinedCall = () => {
        this.props.socket.on('declined call', () => {
            console.log('declined call');
            this.props.history.goBack();
        })
    }

    stoppedCall = () => {
        this.props.socket.on('stop call', () => {
            this.props.history.goBack();
        })
    }

    removeSignalListener = () => {
        this.props.socket.removeListener('client-signal');
        this.props.socket.removeListener('accepted call');
        this.props.socket.removeListener('declined call');
        this.props.socket.removeListener('stop call');
    };
    /*----------------------------------------------*/

    startPeer = (signalUserId, initiator = true) => {
        const peer = new Peer({
            initiator,
            stream: this.stream,
            trickle: false,
        });
        console.log(peer);

        peer.on('signal', data => {
                console.log('Signallling', data);
                const signal = {
                    type: 'signal',
                    userId: this.props.auth.user.id,
                    conversation: this.props.location.state.conversationId,
                    data
                };
                this.props.socket.emit(`client-signal`, (signal));
            }
        );

        peer.on('stream', (stream) => {
            console.log(stream);
            if(this.userVideo !== null){
                try {
                    this.userVideo.srcObject = stream;
                } catch(e) {
                    this.userVideo.src = URL.createObjectURL(stream);
                }
                this.userVideo.play();
            }

        });

        peer.on('close', () => {
            console.log('connection closed');
            let peer = this.peers[this.props.auth.user.id];
            if(peer !== undefined) {
                peer.destroy();
            }
            this.peers[this.props.auth.user.id] = undefined;
        });

        return peer;
    };

    endCall = () => {
        this.props.stopVideoConversation(this.props.socket, this.props.location.state.conversationId, this.props.history);
    }

    toggleAudio = () => {
        this.setState({ muted: !this.state.muted}, () => {
            this.stream.getAudioTracks()[0].enabled = !this.state.muted;
        });
    }


    render() {
        return (
            <div id="VideoCallContainer">
                <video id='my-video' ref={(ref) => {this.myVideo = ref}} />
                <video id='user-video' ref={(ref) => {this.userVideo = ref}} />
                {this.state.requestInProgress && <div id="connection-message">Connecting...</div>}
                <div id="video-options">
                    <div className={this.state.muted? "option selected" : "option"} onClick={this.toggleAudio}>
                        <i className="material-icons icon">
                            mic_off
                        </i>
                    </div>
                    <div className="option decline" onClick={this.endCall}>
                        <i className="material-icons end-call icon">
                            call_end
                        </i>
                    </div>
                    <div className="option mute" onClick={() => {}}>
                        <i className="material-icons icon">
                            videocam_off
                        </i>
                    </div>
                </div>
            </div>
        );
    }
}

VideoCall.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
})

export default connect(
    mapStateToProps,
    {
        stopVideoConversation
    }
)(VideoCall)
