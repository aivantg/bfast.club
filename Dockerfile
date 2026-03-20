# syntax=docker/dockerfile:1.4

# Stage 1: Install deps and build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Cache npm modules across builds
RUN --mount=type=cache,target=/root/.npm \
  npm ci --prefer-offline --cache=/root/.npm --no-progress

COPY . .

# Cache Next.js build artifacts (.next/cache) across builds
RUN --mount=type=cache,target=/app/.next/cache \
  npm run build

# Stage 2: Minimal production image using Next.js standalone output
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
