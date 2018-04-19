FROM node:8.1.2

# Install Hugo
ADD https://github.com/gohugoio/hugo/releases/download/v0.37.1/hugo_0.37.1_Linux-64bit.tar.gz /tmp

RUN mkdir -p /usr/src/app \
    && mkdir -p /usr/src/static-site \
    && tar -xf /tmp/hugo_0.37.1_Linux-64bit.tar.gz -C /tmp \
    && mkdir -p /usr/local/sbin \
    && mv /tmp/hugo /usr/local/sbin/hugo \
    && rm -rf /tmp/hugo_0.37.1_linux_amd64

# Install app dependencies
COPY app/package.json /usr/src/app/
COPY app/build /usr/src/app/build
COPY static-site/package.json /usr/src/static-site/

WORKDIR /usr/src/app
RUN npm install

WORKDIR /usr/src/static-site
RUN npm install

# Bundle app source
# (do this after dependencies so that when 
# code changes, we don't need to repeat that step)
COPY ./app /usr/src/app

WORKDIR /usr/src/app/src
RUN npm start build

# ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/env/google-application-credentials.json

# Copy static site files
COPY static-site /usr/src/static-site

EXPOSE 8080
CMD ["npm","run","start"]
