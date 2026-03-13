import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { handleSocket } from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  methods: ["GET", "POST"]
}));
app.use(express.json());

// Basic route to confirm server is alive
app.get("/", (req, res) => {
  res.send("GhostRoom server is running.");
});

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.io to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Hand off all socket logic to socketHandler
io.on("connection", (socket) => {
  handleSocket(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`GhostRoom server running on port ${PORT}`);
});