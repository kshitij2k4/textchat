import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.29.109:5000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("message");
      socket.off("users");
    };
  }, []);

  useEffect(() => {
    if (username.trim()) {
      socket.emit("setUsername", username);
    }
  }, [username]);

  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socket.emit("sendMessage", { username, message });
      setMessage("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Team Collaboration Hub
      </h2>

      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={handleUsernameChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Chat Box */}
        <div style={{ flex: 3 }}>
          <div
            className="chat-box"
            ref={chatBoxRef}
            style={{
              height: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              marginBottom: "15px",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Enter a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 20px",
                border: "none",
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Online Users */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "10px",
            backgroundColor: "#f1f1f1",
          }}
        >
          <h4>👥 Online Users</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {onlineUsers.map((user, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chat;