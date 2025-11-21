// src/App.js
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-server-kdy6.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [tempName, setTempName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Socket listeners
  useEffect(() => {
    socket.on("chat message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("typing", (user) => {
      if (user !== username) {
        setTypingUser(user);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingUser(""), 2000);
      }
    });
    return () => {
      socket.off("chat message");
      socket.off("typing");
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSetUsername = () => {
    if (tempName.trim() !== "") setUsername(tempName.trim());
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgObj = {
        username,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      socket.emit("chat message", msgObj);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") sendMessage(); };
  const handleTyping = () => { socket.emit("typing", username); };
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Styles
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "20px auto",
      padding: "0 10px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: darkMode ? "#121212" : "#f0f0f0",
      color: darkMode ? "#fff" : "#222",
      minHeight: "100vh",
      position: "relative",
    },
    watermark: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "80px",
      color: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      userSelect: "none",
      zIndex: 0,
      textAlign: "center",
    },
    title: {
      textAlign: "center",
      marginBottom: "15px",
      zIndex: 1,
      position: "relative",
      fontSize: "24px",
    },
    chatWindow: {
      borderRadius: "10px",
      padding: "15px",
      height: "60vh",
      minHeight: "300px",
      overflowY: "scroll",
      background: darkMode ? "#1e1e1e" : "linear-gradient(135deg, #ffffff, #e0f7fa)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      zIndex: 1,
    },
    chatMessage: {
      maxWidth: "75%",
      padding: "10px 15px",
      margin: "5px 0",
      borderRadius: "20px",
      wordWrap: "break-word",
      fontSize: "14px",
    },
    msgLeft: {
      backgroundColor: darkMode ? "#333" : "#2196f3",
      color: darkMode ? "#fff" : "white",
      alignSelf: "flex-start",
      borderBottomLeftRadius: "0",
    },
    msgRight: {
      backgroundColor: darkMode ? "#555" : "#e1f5fe",
      color: darkMode ? "#fff" : "#333",
      alignSelf: "flex-end",
      borderBottomRightRadius: "0",
    },
    usernameText: { fontSize: "12px", fontWeight: "bold", marginBottom: "2px" },
    timeText: { fontSize: "10px", color: "#888", marginTop: "3px", textAlign: "right" },
    inputContainer: { display: "flex", marginTop: "10px", flexDirection: "column", zIndex: 1 },
    typingText: { fontSize: "12px", color: darkMode ? "#bbb" : "#555", marginBottom: "5px", fontStyle: "italic" },
    inputRow: { display: "flex", flexWrap: "wrap" },
    input: {
      flex: 1,
      padding: "12px 15px",
      borderRadius: "25px 0 0 25px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "15px",
      backgroundColor: darkMode ? "#333" : "#fff",
      color: darkMode ? "#fff" : "#000",
      minWidth: "0",
      marginBottom: "5px",
    },
    sendButton: {
      padding: "12px 20px",
      border: "none",
      backgroundColor: "#2196f3",
      color: "white",
      cursor: "pointer",
      borderRadius: "0 25px 25px 0",
      fontWeight: "bold",
      minWidth: "80px",
      marginBottom: "5px",
    },
    darkModeButton: {
      margin: "10px auto",
      display: "block",
      padding: "8px 16px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      backgroundColor: darkMode ? "#555" : "#222",
      color: "#fff",
      fontWeight: "bold",
      zIndex: 1,
      position: "relative",
      fontSize: "14px",
    },
    nameContainer: { display: "flex", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" },
    nameInput: { padding: "12px 15px", borderRadius: "25px 0 0 25px", border: "1px solid #ccc", outline: "none", fontSize: "15px", flex: "1 1 200px", marginBottom: "5px" },
    nameButton: { padding: "12px 25px", border: "none", backgroundColor: "#2196f3", color: "white", cursor: "pointer", borderRadius: "0 25px 25px 0", fontWeight: "bold", flex: "0 0 auto", marginBottom: "5px" },
    footer: { textAlign: "center", fontSize: "12px", marginTop: "10px", color: darkMode ? "#bbb" : "#555", zIndex: 1, position: "relative" },
  };

  // Username input screen
  if (!username) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>💬 Chat by Bleonit Ymeri</h1>
        <div style={styles.nameContainer}>
          <input
            type="text"
            placeholder="Enter your name..."
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            style={styles.nameInput}
            onKeyPress={(e) => e.key === "Enter" && handleSetUsername()}
          />
          <button onClick={handleSetUsername} style={styles.nameButton}>Join</button>
        </div>
      </div>
    );
  }

  // Main chat screen
  return (
    <div style={styles.container}>
      <div style={styles.watermark}>Bleonit Ymeri</div>
      <h1 style={styles.title}>💬 Chat by Bleonit Ymeri</h1>
      <button style={styles.darkModeButton} onClick={toggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => {
          const isMe = msg.username === username;
          return (
            <div key={index} style={{ ...styles.chatMessage, ...(isMe ? styles.msgRight : styles.msgLeft) }}>
              <div style={styles.usernameText}>{msg.username}</div>
              <div>{msg.text}</div>
              <div style={styles.timeText}>{msg.time}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        {typingUser && <div style={styles.typingText}>{typingUser} is typing...</div>}
        <div style={styles.inputRow}>
          <input
            type="text"
            value={message}
            onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendButton}>Send</button>
        </div>
      </div>
      <div style={styles.footer}>Created by Bleonit Ymeri – Fullstack Developer</div>
    </div>
  );
}

export default App;
