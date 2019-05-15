FROM node:12.2

# Force binary name because the current linux architecture
# wasn't available on GitHub as a prebuilt binary
# ENV SASS_BINARY_NAME linux-x64-59_binding.node

ENV GOOGLE_APPLICATION_CREDENTIALS ./app/config/google-application-credentials.json

# Install Hugo
ADD https://github.com/gohugoio/hugo/releases/download/v0.37.1/hugo_0.37.1_Linux-64bit.tar.gz /tmp

RUN tar -xf /tmp/hugo_0.37.1_Linux-64bit.tar.gz -C /tmp \
    && mkdir -p /usr/local/sbin \
    && mv /tmp/hugo /usr/local/sbin/hugo \
    && rm -rf /tmp/hugo_0.37.1_linux_amd64

WORKDIR /usr/src

# Install app dependencies
COPY ./app/package*.json ./app/
COPY ./static-site/package*.json ./static-site/

RUN set -ex \
    && npm install --prefix ./app ./app \
    && npm install --prefix ./static-site ./static-site

# Copy the rest of the files
COPY . ./

# Build
# EVERYTHING THAT HAPPENS HERE MUST BE
# ENVIRONMENT-AGNOSTIC
RUN set -ex \
    && npm run build --prefix ./app \
    && hugo --source="./static-site" \
    && npm run build --prefix ./static-site \
    && npm prune --production --prefix ./app

EXPOSE 8080
CMD ["bash","/usr/src/scripts/run.sh"]
