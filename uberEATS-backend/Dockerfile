# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose ports for different services
EXPOSE 2001
EXPOSE 2002
EXPOSE 2003

# Set environment variables
ENV NODE_ENV=production
ENV PORT=2001

# Start the application
CMD ["node", "index.js"]
