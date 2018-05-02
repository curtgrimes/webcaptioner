FROM node:10.0.0

# Install Hugo
ADD https://github.com/gohugoio/hugo/releases/download/v0.37.1/hugo_0.37.1_Linux-64bit.tar.gz /tmp

RUN tar -xf /tmp/hugo_0.37.1_Linux-64bit.tar.gz -C /tmp \
    && mkdir -p /usr/local/sbin \
    && mv /tmp/hugo /usr/local/sbin/hugo \
    && rm -rf /tmp/hugo_0.37.1_linux_amd64

# Install app dependencies
COPY . /usr/src

WORKDIR /usr/src/app
RUN npm install
RUN npm run build

WORKDIR /usr/src/static-site
RUN npm install

WORKDIR /usr/src

EXPOSE 8080
CMD ["bash","startup.sh"]
