# Coup Online

## [Play Game](https://coupgame.com)

## Overview

The frontend is a `React` web application. The app talks to the backend `Express` server via the `WebSockets` protocol, falling back to the `HTTPS` protocol if the socket connection fails. The game state is stored in a cloud `Redis` database.

## Internationalization

New languages can be defined by doing the following:

- Define the new language here: [availableLanguages.ts](./client/src/i18n/availableLanguages.ts)
- Add translations for the new language here: [translations.ts](./client/src/i18n/translations.ts)

## Deployments

Deployments are automated. To deploy a new version of the game, simply create a new [Release](https://github.com/lounsbrough/coup-online/releases).

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
