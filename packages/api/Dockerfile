# Build stage
FROM oven/bun:1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY packages/utilities/package.json packages/utilities/
COPY packages/canonical/package.json packages/canonical/
COPY packages/data/package.json packages/data/
COPY packages/api/package.json packages/api/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY packages/utilities packages/utilities
COPY packages/canonical packages/canonical
COPY packages/data packages/data
COPY packages/api packages/api
COPY tsconfig.base.json ./

# Production stage
FROM oven/bun:1-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json /app/bun.lockb ./
COPY --from=builder /app/packages packages
COPY --from=builder /app/tsconfig.base.json ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["bun", "run", "packages/api/src/index.ts"]