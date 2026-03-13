import { useState, useRef, useEffect } from "react";
import socket from "../socket/socket";
import { encryptMessage } from "../crypto/encryption";
import MessageBubble from "./MessageBubble";
import "./Chat.css";

export default function Chat({ messages, typingUser, username, roomCode }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;

    const encrypted = encryptMessage(input.trim(), roomCode);

    const message = {
      id: crypto.randomUUID(),
      sender: username,
      encrypted,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      type: "message"
    };

    socket.emit("send-message", { roomCode, message });
    socket.emit("stop-typing", { roomCode });
    clearTimeout(typingTimeout.current);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  function handleTyping(e) {
    setInput(e.target.value);
    socket.emit("typing", { roomCode, username });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { roomCode });
    }, 1500);
  }

  return (
    <div className="chat-container">

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">
            No messages yet. Say something —<br />it won't last forever.
          </p>
        )}

        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id || index}
            message={msg}
            isOwn={msg.sender === username}
            roomCode={roomCode}
          />
        ))}

        {/* Typing Indicator */}
        {typingUser && (
          <div className="chat-typing">
            <span>{typingUser} is typing</span>
            <span className="chat-typing-cursor" />
          </div>
        )}

        {/* Anchor for auto scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>

    </div>
  );
}