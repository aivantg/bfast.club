# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --prefer-offline --cache=/root/.npm --no-progress

COPY . .
RUN --mount=type=cache,target=/app/.next/cache \
  npm run build

# Production image — use Next.js standalone output
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
