import { useState } from "react";
import "./RoomCode.css";

export default function RoomCode({ code }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="roomcode-wrapper" onClick={handleCopy}>
      <span className="roomcode-label">Room</span>
      <span className="roomcode-code">{code}</span>
      <div className="roomcode-divider" />
      <span className="roomcode-copy">{copied ? "Copied!" : "Copy"}</span>
    </div>
  );
}