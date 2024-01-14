# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy server/package.json and server/package-lock.json to the working directory
COPY server/package*.json ./server/

# Copy client/package.json and client/package-lock.json to the working directory
# COPY client/package*.json ./client/

# Install dependencies for both the server and client
RUN cd server && yarn
# RUN cd client && yarn

# Copy the rest of your application code to the container
COPY . .

# Expose the port your Node.js app is running on (if needed)
EXPOSE 3000

# Define the command to run your Node.js app (adjust as needed)
CMD ["node", "server.js"]
