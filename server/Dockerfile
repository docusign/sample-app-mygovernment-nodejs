# Use a Node.js base image
FROM --platform=linux/amd64 node:20.14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package.json ./package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 5000

# Run the backend
CMD ["npm", "start"]
