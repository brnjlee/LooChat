import React, { useState, useEffect } from "react";
import "./ConversationList.css";
import { FiSearch } from "react-icons/fi";

import { connect } from "react-redux";
import { getUserResults } from "../../actions/search";
import {
  addUser,
  confirmUser,
  getPendingConnections
} from "../../actions/authentication";

import UserCard from "../../components/UserCard";
import Conversation from "../Conversation/Conversation";
import Navbar from "../Navbar/Navbar";

const ConversationList = ({
  selectedConversation,
  connections,
  conversations,
  getConversation,
  getUserResults,
  searchResults,
  auth,
  addUser,
  confirmUser
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    let handler;
    if (searchValue.length > 1) {
      if (page === "search") {
        handler = setTimeout(() => {
          getUserResults(searchValue);
        }, 200);
      } else {
        const regex = new RegExp(`^${searchValue}?[^s]+`, "i");
        setUserResults(
          connections.filter(connection => regex.test(connection.name))
        );
      }
    }
    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const searchUsers = e => {
    setSearchValue(e.target.value);
  };

  const results = searchResults.userResults.map((user, i) => {
    if (user.acc_connections.includes(auth.user.username)) {
      return (
        <UserCard
          key={i}
          isRequested={false}
          isAccepted={true}
          isPending={false}
          user={user}
          addUser={id => {
            getConversation(id);
          }}
        />
      );
    } else if (user.pnd_connections.includes(auth.user.username)) {
      return (
        <UserCard
          key={i}
          isRequested={true}
          isAccepted={false}
          isPending={false}
          user={user}
          addUser={() => {}}
        />
      );
    } else if (user.req_connections.includes(auth.user.username)) {
      return (
        <UserCard
          key={i}
          isRequested={false}
          isAccepted={false}
          isPending={true}
          user={user}
          addUser={() => {
            confirmUser(user.username, searchValue);
          }}
        />
      );
    } else {
      return (
        <UserCard
          key={i}
          isRequested={false}
          isAccepted={false}
          isPending={false}
          user={user}
          addUser={() => {
            addUser(user.username, searchValue);
          }}
        />
      );
    }
  });

  const renderConversations = conversations.map((conversation, i) => {
    if (page === "dashboard") {
      return (
        <Conversation
          id={conversation[2].endpointId}
          key={i}
          selected={conversation[0].conversationId === selectedConversation.id}
          title={conversation[1].title[0]}
          searchConvo={false}
          content={conversation[0].content}
          handleClick={() => {
            getConversation(conversation[2].endpointId);
          }}
        />
      );
    }
    return;
  });

  const renderUsers =
    page === "search"
      ? results
      : userResults.map((user, i) => {
          return (
            <Conversation
              id={`0${user._id}`}
              key={i}
              title={user}
              searchConvo={true}
              onMouseDown={e => e.preventDefault()}
              handleClick={() => {
                getConversation(`0${user._id}`);
              }}
            />
          );
        });

  const headerTitle = {
    dashboard: "Chats",
    search: "Search",
    add: "New chat",
    call: "Call",
    user: "User"
  };

  return (
    <div id="ConversationWindow">
      <div className="conversation-window__inner">
        <div id="header">
          <span id="header-span-messages">{headerTitle[page]}</span>
        </div>
        <div id="search-container">
          <input
            type="text"
            id="user-search"
            placeholder="Search users"
            autoComplete="off"
            onChange={searchUsers}
            value={searchValue}
            onBlur={() => {
              if (page !== "search") {
                setSearchValue("");
                setUserResults([]);
              }
            }}
          />
          <FiSearch className="search-icon" />
        </div>
        <div id="ConversationList">
          {searchValue.length ? renderUsers : renderConversations}
        </div>
        <Navbar
          page={page}
          changePage={page => {
            setSearchValue("");
            setPage(page);
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  errors: state.errors,
  searchResults: state.searchResults
});

export default connect(
  mapStateToProps,
  {
    getUserResults,
    addUser,
    confirmUser,
    getPendingConnections
  }
)(ConversationList);
