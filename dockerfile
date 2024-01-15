# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the root package.json and yarn.lock
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn install

# Copy the server directory
COPY server/ ./server/

# Set the working directory to the server
WORKDIR /app/server

# Expose the port your Node.js app is running on
EXPOSE 3001

# Define the command to run your application
CMD ["yarn", "dev"]
