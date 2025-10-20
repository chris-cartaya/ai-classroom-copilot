import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import { useNavigate } from "react-router-dom";

export default function StudentView() {
  const [messages, setMessages] = useState([]); // store chat history
  const navigate = useNavigate();

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message first
    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "bot", text: "Sample response" },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar title="AI Assistant  Student" />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "200px",
            background: "darkblue",
            color: "white",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            onClick={() => navigate("/instructor")}
            style={{
              background: "green",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Switch to Instructor Mode
          </button>
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "white",
            padding: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingRight: "10px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  background: msg.sender === "user" ? "#DCF8C6" : "#E6E6E6",
                  color: "black",
                  padding: "10px 15px",
                  borderRadius: "15px",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}


