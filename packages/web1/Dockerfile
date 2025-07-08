# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.2.15
FROM oven/bun:${BUN_VERSION}-slim as base

# Web app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install -y python3 build-essential pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Stage 1: Install dependencies
FROM base as deps

# Install node modules
COPY package.json bun.lockb ./
COPY packages/web1/package.json ./packages/web1/
COPY packages/data/package.json ./packages/data/
COPY packages/canonical/package.json ./packages/canonical/
COPY packages/utilities/package.json ./packages/utilities/

RUN bun install --frozen-lockfile

# Stage 2: Build dependencies
FROM base as build-deps

# Copy all source code
COPY --from=deps /app/node_modules /app/node_modules
COPY . .

# Build dependencies in order
WORKDIR /app/packages/utilities
RUN bun run build

WORKDIR /app/packages/canonical
RUN bun run build

WORKDIR /app/packages/data
RUN bun run build

# Stage 3: Build web1
FROM build-deps as build

WORKDIR /app/packages/web1

# Build the app
RUN bun run build

# Stage 4: Final image
FROM base

# Copy built application
COPY --from=build /app/packages/web1/build /app/build
COPY --from=build /app/packages/web1/package.json /app/

# Install production dependencies only for serving
RUN bun add @react-router/serve

# Start the server
EXPOSE 3000
CMD ["bun", "run", "start"]