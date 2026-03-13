import {
  generateRoomCode,
  createRoom,
  joinRoom,
  leaveRoom,
  getRoom,
  roomExists
} from "../utils/roomManager.js";

export function handleSocket(io, socket) {
  console.log(`User connected: ${socket.id}`);

  // ─── CREATE ROOM ───────────────────────────────────────────
  socket.on("create-room", ({ username }) => {
    const roomCode = generateRoomCode();
    const room = createRoom(roomCode, username, socket.id);

    // Join the Socket.io room channel
    socket.join(roomCode);

    // Confirm back to the creator
    socket.emit("room-created", {
      roomCode,
      members: room.members
    });

    console.log(`Room ${roomCode} created by ${username}`);
  });

  // ─── JOIN ROOM ─────────────────────────────────────────────
  socket.on("join-room", ({ username, roomCode }) => {
    if (!roomExists(roomCode)) {
      socket.emit("error", { message: "Room not found. Check the code and try again." });
      return;
    }

    const room = joinRoom(roomCode, username, socket.id);
    socket.join(roomCode);

    // Tell the joiner they're in
    socket.emit("room-joined", {
      roomCode,
      members: room.members
    });

    // Tell everyone else in the room
    socket.to(roomCode).emit("member-joined", {
      username,
      members: room.members
    });

    console.log(`${username} joined room ${roomCode}`);
  });

  // ─── SEND MESSAGE ──────────────────────────────────────────
  socket.on("send-message", ({ roomCode, message }) => {
    // message arrives encrypted — we just forward it, never read it
    io.to(roomCode).emit("new-message", message);
  });

  // ─── TYPING INDICATOR ──────────────────────────────────────
  socket.on("typing", ({ roomCode, username }) => {
    // Tell everyone EXCEPT the typer
    socket.to(roomCode).emit("user-typing", { username });
  });

  socket.on("stop-typing", ({ roomCode }) => {
    socket.to(roomCode).emit("user-stop-typing");
  });

  // ─── DISCONNECT ────────────────────────────────────────────
  socket.on("disconnect", () => {
    const result = leaveRoom(socket.id);

    if (result) {
      const { roomCode, username } = result;

      // Tell remaining members someone left
      io.to(roomCode).emit("member-left", {
        username,
        members: getRoom(roomCode)?.members || []
      });

      console.log(`${username} left room ${roomCode}`);
    }

    console.log(`Socket disconnected: ${socket.id}`);
  });
}