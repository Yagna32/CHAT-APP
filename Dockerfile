# Base Image
FROM node:18.0-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./ 

RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

# Run the application.
CMD npm run start
