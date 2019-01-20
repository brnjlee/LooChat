import React, { Component } from 'react';
import './Input.css';
import PropTypes from 'prop-types';

class Input extends Component {
    constructor() {
        super();
        this.state = {
            body: '',
            rows: 1,
        };
        this.map= {13: false, 16: false}; //map keeps track of which keys are being held down
        this.lineHeight = 20;
    }

    handleKeyDown = (e) => {
        let body = this.state.body.trim();
        if (e.keyCode in this.map) {
            this.map[e.keyCode] = true; //if key is pressed down set map to true

            if (this.map[13] && this.map[16]) {
            }
            else if (this.map[13] && body) {
                e.preventDefault(); //prevents new line from appearing in textarea
                this.props.onSend(body);
                this.setState({
                    body: '',
                    rows: 1
                });
            }
            else if (this.map[13]) {
                e.preventDefault();
            }
        }
    }

    sendBody = () => {
        let body = this.state.body.trim();
        if (body) {
            this.props.onSend(body);
            this.setState({
                body: '',
                rows: 1
            });
        }
    }

    handleKeyUp = (e) => {
        if (e.keyCode in this.map) {
            this.map[e.keyCode] = false; //if key is released set map to false
        }
    }

    handleChange = (e) => { //update textarea rows
        const oldRows = e.target.rows;
        e.target.rows = 1;
        const newRows = ~~(e.target.scrollHeight/this.lineHeight - 1); //round to integer

        if (newRows === oldRows) {
            e.target.rows = newRows;
        }

        this.setState({
            body: e.target.value,
            rows: newRows
        });
    }


    render() {
        return (
            <div id="input-container">
                <textarea
                    className="input_msg_write"
                    autoComplete="off"
                    placeholder="Enter message"
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}
                    onChange={this.handleChange}
                    rows={this.state.rows}
                    value={this.state.body}
                />
                <div id="send-button" onClick={this.sendBody}>
                    Send
                </div>
            </div>
        );
    }
}

Input.propTypes = {
    onSend: PropTypes.func.isRequired
};

export default Input;
