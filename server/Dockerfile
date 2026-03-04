# Build stage
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy shared package
COPY shared/package.json shared/pnpm-lock.yaml* shared/
COPY shared/tsconfig.json shared/
COPY shared/ shared/

# Copy server package
COPY server/package.json server/pnpm-lock.yaml* server/
COPY server/tsconfig.json server/

# Copy client package
COPY client/package.json client/pnpm-lock.yaml* client/
COPY client/tsconfig.json client/vite.config.ts client/index.html client/

# Install dependencies
RUN cd shared && pnpm install --frozen-lockfile || pnpm install
RUN cd server && pnpm install --frozen-lockfile || pnpm install
RUN cd client && pnpm install --frozen-lockfile || pnpm install

# Copy source
COPY server/ server/
COPY client/src/ client/src/
COPY client/public/ client/public/

# Build shared
RUN cd shared && pnpm build

# Build server
RUN cd server && pnpm build

# Build client (same-origin URLs since server serves everything)
ENV VITE_API_BASE_URL=""
ENV VITE_SOCKET_SERVER_URL=""
ENV VITE_SOCKET_SERVER_PATH=/socket.io
RUN cd client && pnpm build

# Production stage
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY server/package.json server/pnpm-lock.yaml* server/
RUN cd server && pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy compiled server
COPY --from=builder /app/server/dist/ server/dist/

# Copy client build
COPY --from=builder /app/client/build/ client/build/

WORKDIR /app/server

ENV CLIENT_BUILD_PATH=/app/client/build

EXPOSE 8008

CMD ["node", "dist/server/index.js"]
