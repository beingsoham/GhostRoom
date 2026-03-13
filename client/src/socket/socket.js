import { io } from "socket.io-client";

const socket = io("https://ghostroom-ee49.onrender.com", {
  autoConnect: false
});

export default socket;