# GhostRoom

GhostRoom is a real-time temporary chat room app built with React + Vite on the frontend and Express + Socket.io on the backend.

Users can create a room, share a short room code, join instantly, and chat with encrypted messages.

## Tech Stack

- Frontend: React, Vite, Socket.io Client, TweetNaCl
- Backend: Node.js, Express, Socket.io
- Realtime transport: WebSocket (with Socket.io fallbacks)
- Deployment target: Render (server), any static host for client (Vercel/Netlify/Render Static)

## Project Structure

```text
GhostRoom/
  client/        # React frontend
  server/        # Express + Socket.io backend
  render.yaml    # Render blueprint (must be at repo root)
```

## Features

- Room creation with generated code (format like `GH-XXXX`)
- Join room by code
- Realtime member join/leave updates
- Realtime messaging
- Typing indicator
- Client-side encryption utilities

## Quick Start (Local)

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 2) Frontend

Open a second terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).

## Environment Variables

### Server (`server/.env`)

- `PORT`: server port (Render provides this automatically)
- `CLIENT_URLS`: comma-separated allowed origins for CORS

Example:

```env
PORT=5000
CLIENT_URLS=http://localhost:5173,http://localhost:5174,https://your-client-domain.com
```

### Client (`client/.env`)

- `VITE_SERVER_URL`: backend base URL used by Socket.io client

Example:

```env
VITE_SERVER_URL=http://localhost:5000
```

## Deployment (Working Configuration)

### Why your deploy likely failed

Render blueprints are discovered from repository root. If `render.yaml` is inside `server/`, Render may not detect it automatically.

This repo is now fixed with `render.yaml` at the root.

### Deploy Backend on Render

1. Push this repository to GitHub.
2. In Render, create a new Blueprint instance from the repo.
3. Confirm service settings from `render.yaml`:
	- `rootDir: server`
	- `startCommand: npm start`
	- `healthCheckPath: /health`
4. Set `CLIENT_URLS` in Render environment:
	- local + production frontend URL(s), comma-separated.
	- example: `https://ghostroom-client.vercel.app`
5. Deploy and copy the backend URL (example: `https://ghostroom-server.onrender.com`).

### Deploy Frontend

Deploy `client/` to Vercel/Netlify/Render Static and set:

```env
VITE_SERVER_URL=https://your-render-backend-url.onrender.com
```

Rebuild frontend after setting the variable.

## Health Check

Backend exposes:

- `GET /` -> basic alive message
- `GET /health` -> `{ "status": "ok" }`

Use `/health` in Render health checks.

## Common Troubleshooting

### CORS error in browser

- Ensure your frontend URL is included in `CLIENT_URLS` on Render.
- If you changed domain, redeploy backend.

### Socket does not connect

- Ensure `VITE_SERVER_URL` points to the backend URL.
- Make sure backend is healthy at `/health`.
- Check browser console and Render logs for blocked origins.

### Frontend works locally but not in production

- Production build needs `VITE_SERVER_URL` at build time.
- Update env var in hosting platform and trigger a new build.

## Scripts

### Server

- `npm run dev` -> run with nodemon
- `npm start` -> production start

### Client

- `npm run dev` -> Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview build locally

## Notes

- Rooms are in-memory only; restarting server clears all active rooms.
- For persistent history or scale-out, add a database + pub/sub adapter.
