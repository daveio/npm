# syntax=docker/dockerfile:1

# Use a minimal base image
FROM alpine:3.22.0 AS base

# Install dependencies for bun (with version pinning)
RUN apk update \
    && apk add --no-cache \
    bash=5.2.37-r0 \
    ca-certificates=20241121-r2 \
    curl=8.14.1-r1 \
    libstdc++=14.2.0-r6 \
    libgcc=14.2.0-r6

# Set shell with pipefail for better error handling
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Set working directory
WORKDIR /app

# Create and use a non-root user (Alpine style)
RUN mkdir -p /app && \
    adduser -D -u 1000 -h /app dave-io && \
    chown -R dave-io /app

# Switch to non-root user for security
USER dave-io
WORKDIR /app

# Install bun (JavaScript runtime)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/app/.bun/bin:$PATH"

# Copy package files first to leverage caching
COPY --chown=dave-io:dave-io package.json bun.lock ./

# Install dependencies using bun
RUN bun install

# Copy the rest of the project files
COPY --chown=dave-io:dave-io . .

# Build the project
RUN bun run build

# Add a healthcheck to ensure the application is working
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node dist/cmd.js || exit 1

# Set the default command to run the CLI
CMD ["node", "dist/cmd.js"]
