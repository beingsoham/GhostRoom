import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { handleSocket } from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

const allowedOrigins = [
  ...defaultOrigins,
  ...(process.env.CLIENT_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (health checks, curl, some server-to-server calls).
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"]
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Basic route to confirm server is alive
app.get("/", (req, res) => {
  res.send("GhostRoom server is running.");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.io to the HTTP server
const io = new Server(httpServer, {
  cors: corsOptions
});

// Hand off all socket logic to socketHandler
io.on("connection", (socket) => {
  handleSocket(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`GhostRoom server running on port ${PORT}`);
});