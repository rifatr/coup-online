# Deploying Coup Online

## Prerequisites

- A Linux server (64-bit recommended)
- Docker and Docker Compose installed
- Git installed

### Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in, then:
sudo apt install docker-compose-plugin
```

## Deployment Steps

### 1. Clone the repository

```bash
git clone <your-repo-url> coup-online
cd coup-online
```

### 2. Build and start

```bash
docker compose up -d --build
```

This starts 2 containers:
- **redis** — game state storage (internal only)
- **server** — Express + Socket.io + static client files (port 8008)

The server serves the React client, API, and WebSocket all on port 8008.

### 3. Access the game

The game is available at `http://localhost:8008`. Point your reverse proxy or tunnel to this port.

## Management

```bash
# View logs
docker compose logs -f

# Stop
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Check status
docker compose ps
```

## Notes

- Redis data persists in a Docker volume (`redis-data`). To reset all game data: `docker compose down -v`
- Building requires ~1GB free RAM. If builds fail, add swap space or build images on a more powerful machine and transfer them.
