import nacl from "tweetnacl";
import { encodeUTF8, decodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";

// Convert room code into a consistent 32-byte key
function generateKey(roomCode) {
  const keyBytes = new Uint8Array(32);
  const codeChars = roomCode.split("").map(c => c.charCodeAt(0));

  for (let i = 0; i < 32; i++) {
    keyBytes[i] = codeChars[i % codeChars.length];
  }

  return keyBytes;
}

// Encrypt a message string using the room code
export function encryptMessage(message, roomCode) {
  const key = generateKey(roomCode);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);

  // Manually convert string to Uint8Array without tweetnacl-util
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);

  const encrypted = nacl.secretbox(messageBytes, nonce, key);

  return {
    nonce: encodeBase64(nonce),
    ciphertext: encodeBase64(encrypted)
  };
}

// Decrypt a message using the room code
export function decryptMessage(encryptedData, roomCode) {
  try {
    const key = generateKey(roomCode);
    const nonce = decodeBase64(encryptedData.nonce);
    const ciphertext = decodeBase64(encryptedData.ciphertext);

    const decrypted = nacl.secretbox.open(ciphertext, nonce, key);

    if (!decrypted) return "[decryption failed]";

    // Manually convert Uint8Array back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);

  } catch (err) {
    console.error("Decryption error:", err);
    return "[decryption failed]";
  }
}