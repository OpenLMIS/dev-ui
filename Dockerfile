FROM debian:jessie

WORKDIR /root

# NOTE bzip2 is required by PhantomJS-prebuilt
# NOTE buildessential is needed for node-sass (installed by gulp-sass)
RUN apt-get update && apt-get install -y bash build-essential libfontconfig transifex-client git curl bzip2

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g bower grunt-cli phantomjs-prebuilt

WORKDIR /dev-ui
VOLUME ["/dev-ui", "/app"]

COPY package.json .
COPY bower.json .
COPY config.json .
COPY ordered-application-directory.js .
COPY LICENSE-HEADER .
COPY tasks/* ./tasks/
COPY src ./src
COPY styleguide ./styleguide
COPY docs ./docs

# Port 9000 used for dev server
# Port 9876 user for karma debugger
EXPOSE 9000 9876
