// src/App.js
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Use your Render backend URL here
const socket = io("https://chat-server-kdy6.onrender.com");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Real-Time Chat App</h1>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          backgroundColor: "#f9f9f9",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: "left",
              margin: "5px 0",
              padding: "5px 10px",
              backgroundColor: "#e1f5fe",
              borderRadius: "5px",
              display: "inline-block",
            }}
          >
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px 0 0 5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: "#2196f3",
            color: "white",
            cursor: "pointer",
            borderRadius: "0 5px 5px 0",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
