FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS release
COPY . .
RUN bun install
USER bun

FROM release AS mireamour-bot
ENTRYPOINT [ "bun", "run", "index.ts" ]