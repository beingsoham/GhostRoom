import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCreate() {
    if (!username.trim()) {
      setError("Enter a username first.");
      return;
    }

    setLoading(true);
    socket.connect();

    socket.emit("create-room", { username });

    socket.on("room-created", ({ roomCode, members }) => {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("roomCode", roomCode);
      sessionStorage.setItem("members", JSON.stringify(members));
      navigate(`/room/${roomCode}`);
    });
  }

  function handleJoin() {
    if (!username.trim()) {
      setError("Enter a username first.");
      return;
    }
    if (!roomCode.trim()) {
      setError("Enter a room code.");
      return;
    }

    setLoading(true);
    socket.connect();

    socket.emit("join-room", { username, roomCode: roomCode.toUpperCase() });

    socket.on("room-joined", ({ roomCode, members }) => {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("roomCode", roomCode);
      sessionStorage.setItem("members", JSON.stringify(members));
      navigate(`/room/${roomCode}`);
    });

    socket.on("error", ({ message }) => {
      setError(message);
      setLoading(false);
      socket.disconnect();
    });
  }

  return (
    <div className="landing-page">

      {/* Aurora background */}
      <div className="landing-aurora">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-orb aurora-orb-4" />
      </div>

      <div className="landing-card">

        {/* Header */}
        <div className="landing-header">
          <h1 className="landing-logo">GhostRoom</h1>
          <p className="landing-tagline">Anonymous. Ephemeral. Encrypted.</p>
        </div>

        {/* Divider */}
        <div className="landing-divider" />

        {/* Username Input */}
        <div className="landing-field">
          <label className="landing-label">Username</label>
          <input
            className="landing-input"
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Mode Selector */}
        {!mode && (
          <div className="landing-mode-row">
            <button className="btn-primary" onClick={() => setMode("create")}>
              Create Room
            </button>
            <button className="btn-outline" onClick={() => setMode("join")}>
              Join Room
            </button>
          </div>
        )}

        {/* Create Mode */}
        {mode === "create" && (
          <div className="landing-section">
            <p className="landing-hint">
              A unique room code will be generated for you to share.
            </p>
            <button
              className={loading ? "btn-disabled" : "btn-primary"}
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
            <button className="btn-ghost" onClick={() => setMode(null)}>
              ← Back
            </button>
          </div>
        )}

        {/* Join Mode */}
        {mode === "join" && (
          <div className="landing-section">
            <div className="landing-field">
              <label className="landing-label">Room Code</label>
              <input
                className="landing-input"
                type="text"
                placeholder="e.g. GH-7X2K"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setError("");
                }}
              />
            </div>
            <button
              className={loading ? "btn-disabled" : "btn-primary"}
              onClick={handleJoin}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
            <button className="btn-ghost" onClick={() => setMode(null)}>
              ← Back
            </button>
          </div>
        )}

        {/* Error */}
        {error && <p className="landing-error">{error}</p>}

        {/* Footer */}
        <p className="landing-footer">
          All messages are encrypted and disappear when everyone leaves.
        </p>

      </div>
    </div>
  );
}