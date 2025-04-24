# Use the official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend source code to the container
COPY . .

# Expose the port on which your backend runs
EXPOSE 2000

# Define the command to start the backend server
CMD ["node", "index.js"]
