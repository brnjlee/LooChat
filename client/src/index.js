import React from "react";
import ReactDOM from "react-dom";
import "./styles/styles.css";
import App from "./App";
console.log = console.warn = console.error = () => {};
ReactDOM.render(<App />, document.getElementById("root"));
