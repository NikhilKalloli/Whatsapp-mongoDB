# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env file (ensure .env is not in .dockerignore)
COPY .env .env

# Expose the port the app runs on (adjust as per your app.js)
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]