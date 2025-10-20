import Navbar from "../components/Navbar";
import ChatInput from "../components/ChatInput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InstructorView() {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleSend = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "bot", text: "Sample response" },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar title="AI Assistant  Instructor" />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            background: "darkblue",
            color: "white",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {[
            "View Common Question",
            "View Class Summary",
            "View Chat Logs",
            "Generate Weekly Quiz",
            "Edit Course Materials",
            "Switch to Student Mode",
          ].map((label, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (label === "Switch to Student Mode") navigate("/");
                if (label === "Edit Course Materials")
                  navigate("/course-materials");
              }}
              style={{
                background: "green",
                color: "white",
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {label}
            </button>
          ))}
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
