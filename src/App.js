// src/App.js
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

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

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "0 15px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
      textAlign: "center",
      color: "#222",
      marginBottom: "20px",
    },
    chatWindow: {
      borderRadius: "10px",
      padding: "15px",
      height: "450px",
      overflowY: "scroll",
      background: "linear-gradient(135deg, #ffffff, #e0f7fa)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
    },
    chatMessage: {
      maxWidth: "75%",
      padding: "10px 15px",
      margin: "5px 0",
      borderRadius: "20px",
      wordWrap: "break-word",
      fontSize: "15px",
      animation: "fadeIn 0.3s ease",
    },
    msgLeft: {
      backgroundColor: "#2196f3",
      color: "white",
      alignSelf: "flex-start",
      borderBottomLeftRadius: "0",
    },
    msgRight: {
      backgroundColor: "#e1f5fe",
      color: "#333",
      alignSelf: "flex-end",
      borderBottomRightRadius: "0",
    },
    inputContainer: {
      display: "flex",
      marginTop: "10px",
    },
    input: {
      flex: 1,
      padding: "12px 15px",
      borderRadius: "25px 0 0 25px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "15px",
    },
    sendButton: {
      padding: "12px 25px",
      border: "none",
      backgroundColor: "#2196f3",
      color: "white",
      cursor: "pointer",
      borderRadius: "0 25px 25px 0",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Real-Time Chat</h1>

      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.chatMessage,
              ...(index % 2 === 0 ? styles.msgLeft : styles.msgRight),
            }}
          >
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
