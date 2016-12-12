FROM node:6-slim

RUN apt-get update && \
  apt-get install -y  build-essential libfontconfig transifex-client git curl bzip2  && \
  apt-get clean && \
  npm install -g bower grunt-cli

ADD package.json .
ADD bower.json .
RUN npm install --no-optional && \
  bower install --allow-root --config.interactive=false

WORKDIR /app
VOLUME ["/app"]
EXPOSE 9000

CMD ["sh"]
