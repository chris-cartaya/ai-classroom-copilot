import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "10px",
        background: "#ddd",
        borderRadius: "10px",
      }}
    >
      <input
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          fontSize: "16px",
        }}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "10px",
          background: "lightgray",
          borderRadius: "50%",
          border: "none",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        →
      </button>
    </div>
  );
}

