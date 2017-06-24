FROM node:8.1.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/env/google-application-credentials.json

EXPOSE 8101
CMD [ "npm", "start" ]