FROM node:20.10-alpine3.18

# Create app directory
WORKDIR /app

# Copy server application source and shared directory
COPY ./server ./server
COPY ./shared ./shared/

# Change working directory to /app/server
WORKDIR /app/server

# Install app dependencies
RUN npm install

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD
CMD ["npm", "run", "dev"]