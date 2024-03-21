# Use the official image as a parent image.
FROM node:current-slim

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY ["package.json", "package-lock.json*", "./"]
RUN mkdir client
COPY ["client/package.json", "client/package-lock.json*", "./client/"]
RUN mkdir server
COPY ["server/package.json", "server/package-lock.json*", "./server/"]

# Run the command inside your image filesystem.
RUN npm run install-all-prod

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 3000
EXPOSE 4000

# Run the specified command within the container.
CMD [ "npm", "run", "dev" ]

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .
# docker build --rm --tag blockchat .
# docker run --name blockchat-container -p 3000:3000 -p 4000:4000 blockchat