# Build Stage
FROM node:23 AS builder

# Inject API key at compile stage
ARG PLACES_API_KEY
ENV PLACES_API_KEY $PLACES_API_KEY

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Production Stage
FROM node:23-slim

# Inject API key at runtime
ARG PLACES_API_KEY
ENV PLACES_API_KEY $PLACES_API_KEY

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./

# Install only production dependencies
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]

