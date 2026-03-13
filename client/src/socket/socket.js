import { io } from "socket.io-client";

// Connect to our backend server
const socket = io("http://localhost:5000", {
  autoConnect: false // we manually connect when user enters a room
});

export default socket;