# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .
# Compile TypeScript to JavaScript
RUN npm run build

# ---- Release ----
FROM node:20-alpine AS release
WORKDIR /usr/src/app
# Copy production node_modules
COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production
# Copy compiled JavaScript code
COPY --from=base /usr/src/app/dist ./dist

# Start the application
CMD ["node", "dist/index.js"]