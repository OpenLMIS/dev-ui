FROM debian:jessie

WORKDIR /root

# NOTE bzip2 is required by PhantomJS-prebuilt
# NOTE buildessential is needed for node-sass (installed by gulp-sass)
RUN echo 'deb http://deb.debian.org/debian jessie-backports main' > /etc/apt/sources.list.d/jessie-backports.list
RUN apt-get update && apt-get install -y bash build-essential libfontconfig transifex-client git curl bzip2
RUN apt-get install -t jessie-backports openjdk-8-jre-headless ca-certificates-java -y

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g grunt-cli phantomjs-prebuilt yarn

WORKDIR /dev-ui
VOLUME ["/dev-ui", "/app"]

# Default license header
COPY LICENSE-HEADER .

# Linter configuration
COPY .csslintrc .
COPY .eslintrc .
COPY .htmlhintrc .
COPY .sass-lint.yml .

# Build process
COPY sonar.sh .
COPY build.sh .
COPY tasks/* ./tasks/

# Javascript packages
COPY package.json .
COPY package-yarn.json .
COPY config.json .

# Application logic
COPY ordered-application-directory.js .
COPY src ./src
COPY styleguide ./styleguide

# Port 9000 used for dev server
# Port 9876 user for karma debugger
EXPOSE 9000 9876
