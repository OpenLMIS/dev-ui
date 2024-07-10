FROM debian:buster

WORKDIR /root

# NOTE bzip2 is required by PhantomJS-prebuilt
# NOTE buildessential is needed for node-sass (installed by gulp-sass)
RUN apt-get update && apt-get install -y bash build-essential libfontconfig git curl bzip2
RUN curl -o- https://raw.githubusercontent.com/transifex/cli/master/install.sh | bash

RUN apt-get install -y openjdk-11-jre-headless ca-certificates-java 

# Download Chrome dependencies
RUN apt-get install -y -f gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g grunt-cli@1.3.2 phantomjs-prebuilt yarn --unsafe-perm

WORKDIR /dev-ui
VOLUME ["/dev-ui", "/app"]

# Default license header
COPY LICENSE-HEADER .

# Linter configuration
COPY .csslintrc .
COPY .eslintrc .
COPY .htmlhintrc .
COPY .sass-lint.yml .
COPY .stylelintrc .

# Linter Custom Rules
COPY stylelint-rules ./stylelint-rules

# Build process
COPY sonar.sh .
COPY build.sh .
COPY tasks/* ./tasks/
COPY webpack.config.js .

# Javascript packages
COPY package.json .
COPY npm-shrinkwrap.json .
COPY package-yarn.json .
COPY config.json .

# Application logic
COPY ordered-application-directory.js .
COPY src ./src
COPY styleguide ./styleguide

# Port 9000 used for dev server
# Port 9876 user for karma debugger
EXPOSE 9000 9876
