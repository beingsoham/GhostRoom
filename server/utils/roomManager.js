// All active rooms live here — pure RAM, no database
const rooms = new Map();

// Generate a random 6-character room code like "GH-7X2K"
export function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "GH-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a brand new room and store it
export function createRoom(roomCode, username, socketId) {
  const room = {
    roomCode,
    members: [{ username, socketId }],
    messages: []
  };
  rooms.set(roomCode, room);
  return room;
}

// Add a member to an existing room
export function joinRoom(roomCode, username, socketId) {
  const room = rooms.get(roomCode);
  if (!room) return null; // room doesn't exist
  room.members.push({ username, socketId });
  return room;
}

// Remove a member from a room by their socketId
// If room is empty after removal, delete it entirely
export function leaveRoom(socketId) {
  for (const [roomCode, room] of rooms) {
    const index = room.members.findIndex(m => m.socketId === socketId);
    if (index !== -1) {
      const username = room.members[index].username;
      room.members.splice(index, 1);

      // Last person left — wipe the room
      if (room.members.length === 0) {
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted — no members left`);
      }

      return { roomCode, username };
    }
  }
  return null;
}

// Get a room by its code
export function getRoom(roomCode) {
  return rooms.get(roomCode) || null;
}

// Check if a room exists
export function roomExists(roomCode) {
  return rooms.has(roomCode);
}