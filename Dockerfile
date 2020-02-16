FROM node:dubnium

# Installation:

# Create app directory
RUN mkdir /usr/src/app/
WORKDIR /usr/src/app/

# Install app dependencies
COPY . /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
