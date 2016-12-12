FROM node:6-alpine

RUN apk update && \
  apk add --no-cache git build-base python py-pip && \
  pip install --upgrade pip && \
  pip install transifex-client && \
  npm install -g bower grunt-cli

# for phantomjs on alpine
RUN apk add --no-cache fontconfig curl bash && \
  mkdir -p /usr/share && \
  cd /usr/share \
  && curl -L https://github.com/Overbryd/docker-phantomjs-alpine/releases/download/2.11/phantomjs-alpine-x86_64.tar.bz2 | tar xj \
  && ln -s /usr/share/phantomjs/phantomjs /usr/local/bin/phantomjs

WORKDIR /app
VOLUME ["/app"]
EXPOSE 9000

CMD ["sh"]
