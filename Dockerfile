FROM debian:jessie

WORKDIR /root

# NOTE bzip2 is required by PhantomJS-prebuilt
# NOTE buildessential is needed for node-sass (installed by gulp-sass)
RUN apt-get update && apt-get install -y bash build-essential libfontconfig transifex-client git curl bzip2

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g bower grunt-cli phantomjs-prebuilt

WORKDIR /app
VOLUME ["/app"] 

# Port 9000 used for dev server
EXPOSE 9000

CMD rm -rf node_modules/ bower_components/ && npm install --no-optional && bower install --allow-root --config.interactive=false && bash
