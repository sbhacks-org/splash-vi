# Use Node.js 8.2.1 (as specified in package.json engines)
FROM node:8.2.1-slim

# Set working directory
WORKDIR /app

# Fix Debian Jessie archived repositories
RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian/ jessie main" > /etc/apt/sources.list && \
    echo "deb [check-valid-until=no] http://archive.debian.org/debian-security jessie/updates main" >> /etc/apt/sources.list

# Install build dependencies for native modules
RUN apt-get -o Acquire::Check-Valid-Until=false update && \
    apt-get install -y --allow-unauthenticated \
    python \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build CSS and React bundles
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
