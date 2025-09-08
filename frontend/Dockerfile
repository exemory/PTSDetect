# Use a specific node version
FROM node:18-alpine

# Build arguments
ARG VITE_GRAPHQL_URI

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm (as indicated by pnpm-lock.yaml)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Expose the application port
EXPOSE 5173

CMD [ "pnpm", "preview" ]