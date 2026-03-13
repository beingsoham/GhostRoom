import { decryptMessage } from "../crypto/encryption";
import "./MessageBubble.css";

export default function MessageBubble({ message, isOwn, roomCode }) {

  // System messages like "soham joined the room"
  if (message.type === "system") {
    return (
      <div className="bubble-system">
        {message.text}
      </div>
    );
  }

  // Decrypt the message text before displaying
  const decrypted = decryptMessage(message.encrypted, roomCode);

  return (
    <div className={`bubble-wrapper ${isOwn ? "bubble-own" : "bubble-other"}`}>

      {/* Show sender name only for other people's messages */}
      {!isOwn && (
        <span className="bubble-sender">{message.sender}</span>
      )}

      <div className={`bubble ${isOwn ? "bubble-own-bg" : "bubble-other-bg"}`}>
        <p className="bubble-text">{decrypted}</p>
        <span className="bubble-time">{message.timestamp}</span>
      </div>

    </div>
  );
}