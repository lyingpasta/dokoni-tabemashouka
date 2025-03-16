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
FROM node:23-alpine

# Inject API key at runtime
ARG PLACES_API_KEY
ENV PLACES_API_KEY $PLACES_API_KEY

# Copy the built application from the builder stage
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public

# Set the working directory
WORKDIR /app

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npx", "next", "start"]
