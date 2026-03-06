# Coup Online

## Overview

The frontend is a `React` web application. The app talks to the backend `Express` server via the `WebSockets` protocol, falling back to the `HTTPS` protocol if the socket connection fails. The game state is stored in a cloud `Redis` database.

## Internationalization

New languages can be defined by doing the following:

- Define the new language here: [availableLanguages.ts](./client/src/i18n/availableLanguages.ts)
- Add translations for the new language here: [translations.ts](./client/src/i18n/translations.ts)

## Environment Variables

- EXPRESS_PORT
- REDIS_CONNECTION_STRING
- VITE_API_BASE_URL
- VITE_SOCKET_SERVER_URL
- VITE_SOCKET_SERVER_PATH

## Running Locally

### Run Server

```sh
cd server
pnpm i
pnpm dev
```

### Run Client

```sh
cd client
pnpm i
pnpm start
```

### Run Server Tests

_Server needs to be running for integration tests_

```sh
cd server
pnpm test
```

### Run Client Tests

```sh
cd client
pnpm test
pnpm cypress open
```

# Complete Local Development Guide

## Prerequisites

- **Node.js** v18+
- **pnpm** — install with `npm install -g pnpm`
- **Redis** — required by the server

## 1. Install Redis

**Option A — Docker (easiest):**
```sh
docker run -d -p 6379:6379 redis:latest
# Connection string: redis://localhost:6379
```

**Option B — Cloud Redis (no local install):**
Use [Upstash](https://upstash.com/) for a free hosted Redis instance and copy the connection string it provides.

**Option C — Windows native:**
Install [Memurai](https://www.memurai.com/), a Redis-compatible server for Windows.

## 2. Build the Shared Package

The `shared` package must be compiled before either the server or client can use it:

```sh
cd shared
pnpm install
pnpm build
```

This outputs compiled files to `shared/dist/`.

## 3. Run the Server

Create a `.env` file inside the `server/` directory:

```env
EXPRESS_PORT=8008
REDIS_CONNECTION_STRING=redis://localhost:6379
```

Then install and start:

```sh
cd server
pnpm install
pnpm dev
# Server runs on http://localhost:8008
```

## 4. Run the Client

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:8008
VITE_SOCKET_SERVER_URL=http://localhost:8008
VITE_SOCKET_SERVER_PATH=/socket.io
```

Then install and start:

```sh
cd client
pnpm install
pnpm start
# Client runs on http://localhost:3000
```

> `pnpm start` automatically rebuilds `shared/dist/` before launching Vite.

## Quick Reference

| Terminal | Command | URL |
|----------|---------|-----|
| 1 — Server | `cd server && pnpm dev` | http://localhost:8008 |
| 2 — Client | `cd client && pnpm start` | http://localhost:3000 |

Open http://localhost:3000 in your browser once both are running.

## Important Notes

- **Use `pnpm`, not `npm`** — running `npm install` in the client will fail due to a local path dependency constraint in npm v11+
- **Build shared first** — if you edit any file under `shared/`, run `cd shared && pnpm build` to recompile before the changes are picked up
- **Redis is mandatory** — the server will crash on startup without a valid `REDIS_CONNECTION_STRING`

## Production Deployment

See [DEPLOY.md](./DEPLOY.md) for Docker deployment instructions.

## Project Architecture

  This is a real-time multiplayer card game (Coup) built as a monorepo with 3 packages:

  coup-online/
  ├── client/          → React frontend
  ├── server/          → Express + Socket.IO backend
  ├── shared/          → Shared TypeScript types, game logic, helpers
  ├── docker-compose.yml
  └── docker-compose.server.yml

  ---
  1. shared/ — Shared Library

  The glue between client and server. Compiled to JS via tsc and imported by both sides.

  - types/game.ts — All core TypeScript types: Actions, Influences, Responses, PlayerActions, ServerEvents,
  GameSettings, PublicGameState, etc. This is the single source of truth for game enums and interfaces.
  - game/logic.ts — Shared game logic used by both client and server.
  - helpers/ — Utility functions like dehydratePublicGameState (serializes game state for transport).
  - i18n/ — AvailableLanguageCode enum defining supported languages.

  ---
  2. server/ — Backend (Express + Socket.IO + Redis)

  Tech stack: Node.js, Express 5, Socket.IO 4, Redis 7, Joi validation, TypeScript

  How it works:

  - index.ts — The main entry point (~630 lines). Sets up:
    - Express HTTP server on port 8008
    - Socket.IO WebSocket server on top of it (for real-time gameplay)
    - Dual API — Every game action is exposed as both a REST endpoint AND a Socket.IO event, using a shared
  eventHandlers map
  - src/game/actionHandlers.ts — All game mutation handlers:
    - createGameHandler, joinGameHandler, startGameHandler
    - actionHandler (Income, ForeignAid, Coup, Tax, Assassinate, Steal, Exchange)
    - actionResponseHandler, blockResponseHandler (challenge/block flows)
    - loseInfluencesHandler, sendChatMessageHandler, addAiPlayerHandler, etc.
  - src/utilities/gameState.ts — Reads/writes game state to Redis. Each game room has its state stored in Redis,
  enabling persistence and multi-instance scaling.
  - src/utilities/errors.ts — Custom error class GameMutationInputError with i18n-aware error messages.
  - src/i18n/translations.ts — Server-side translations for error messages.

  Real-time flow:

  1. Client connects via Socket.IO
  2. Client emits a PlayerActions event (e.g., action, actionResponse)
  3. Server validates with Joi, runs the handler, mutates state in Redis
  4. Server broadcasts updated PublicGameState to all sockets in the room
  5. Each player gets their own view (hidden cards are only visible to the owning player)

  Deployment:

  - Docker Compose runs Redis 7 (Alpine) + the Node server
  - Server also serves the client's static build in production (express.static)
  - Has a vercel.json for Vercel deployment support

  ---
  3. client/ — Frontend (React + Vite + MUI)

  Tech stack: React 19, Vite 7, MUI 7 (Material UI), Socket.IO Client, TypeScript, React Router

  Key directories:

  - src/components/ — UI components (game board, rules drawer, language selector, icons, chat, etc.)
  - src/contexts/ — React contexts:
    - TranslationsContext.tsx — i18n system with runtime language switching (currently defaults to bn-BD)
    - Likely a game state context for managing Socket.IO connection and state
  - src/hooks/ — Custom hooks like usePersistedState (localStorage-backed state)
  - src/i18n/translations.ts — All UI translations (8 languages including Bangla)
  - src/assets/ — Character card images (ambassador, assassin, captain, contessa, duke)
  - src/helpers/ — Client utilities (localStorage keys, etc.)

  How the client works:

  1. Vite serves the app with index.html as entry, loading src/index.tsx
  2. React Router handles navigation (create game, join game, game room)
  3. Socket.IO client connects to the server
  4. On every gameStateChanged event, the UI re-renders with the latest game state
  5. Player actions (Income, Coup, Steal, etc.) are emitted via Socket.IO
  6. MUI provides the component library (dialogs, buttons, typography, theming)
  7. @vercel/analytics tracks usage in production

  Testing:

  - Unit tests: Vitest + Testing Library
  - E2E tests: Cypress (cypress/ directory)

  ---
  4. Data Flow Summary

  ┌──────────┐   Socket.IO    ┌──────────┐    Read/Write     ┌───────┐
  │  Client  │ ◄────────────► │  Server   │ ◄──────────────► │ Redis │
  │  (React) │   WebSocket    │ (Express) │   Game State     │  (DB) │
  └──────────┘                └──────────┘                   └───────┘
        │                           │
        └── shared types/logic ─────┘

  - Client sends player actions via WebSocket
  - Server validates input (Joi), applies game logic, stores state in Redis
  - Server broadcasts the new public game state to all players in the room
  - Shared package ensures type safety across the boundary

  ---
  5. Game Features

  - 2-6 players per room
  - AI opponents with configurable personality (vengefulness, honesty, skepticism)
  - Real-time in-game chat with emoji reactions and message deletion
  - QR code for sharing game room links
  - Speed round timer option
  - Forfeit with AI replacement
  - Game reset voting system
