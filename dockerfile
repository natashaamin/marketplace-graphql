# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the working directory
COPY package*.json ./

# Install all dependencies in the root folder
RUN yarn install

# Copy server code to the container
COPY server/ /app/server

# Change to the server directory
WORKDIR /app/server

# Install server dependencies
RUN yarn install:server

# Expose the port your Node.js app is running on
EXPOSE 3000

# Define the command to start your server application
CMD ["yarn", "start:server"]
