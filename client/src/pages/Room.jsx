import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import Chat from "../components/Chat";
import MemberList from "../components/MemberList";
import RoomCode from "../components/RoomCode";
import "./Room.css";

export default function Room() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const username = sessionStorage.getItem("username");

  // ← Read initial members from sessionStorage immediately
  const [members, setMembers] = useState(() => {
    const stored = sessionStorage.getItem("members");
    return stored ? JSON.parse(stored) : [];
  });

  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    // ─── INCOMING EVENTS ───────────────────────────────────────

    socket.on("member-joined", ({ username, members }) => {
      setMembers(members);
      setMessages((prev) => [
        ...prev,
        { type: "system", text: `${username} joined the room` }
      ]);
    });

    socket.on("member-left", ({ username, members }) => {
      setMembers(members);
      setMessages((prev) => [
        ...prev,
        { type: "system", text: `${username} left the room` }
      ]);
    });

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-typing", ({ username }) => {
      setTypingUser(username);
    });

    socket.on("user-stop-typing", () => {
      setTypingUser(null);
    });

    // ─── CLEANUP ───────────────────────────────────────────────
    return () => {
      socket.off("member-joined");
      socket.off("member-left");
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, []);

  function handleLeave() {
    socket.disconnect();
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <div className="room-page">

      {/* Left — Chat Area */}
      <div className="room-main">

        {/* Top Bar */}
        <div className="room-topbar">
          <div className="room-topbar-left">
            <h2 className="room-title">GhostRoom</h2>
            <RoomCode code={roomCode} />
          </div>
          <button className="room-leave-btn" onClick={handleLeave}>
            Leave Room
          </button>
        </div>

        {/* Chat */}
        <Chat
          messages={messages}
          typingUser={typingUser}
          username={username}
          roomCode={roomCode}
        />

      </div>

      {/* Right — Member List */}
      <div className="room-sidebar">
        <MemberList members={members} currentUser={username} />
      </div>

    </div>
  );
}