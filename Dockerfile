FROM openlmis/dev

WORKDIR /root
RUN apk update && \
  apk add git && \
  npm install -g bower && \
  npm install -g grunt

WORKDIR /build
VOLUME ["/build"]

EXPOSE 8080

# add sass in alpine
ADD sass.sh /build
RUN /bin/bash -c '/build/sass.sh'

CMD npm install --no-optional
CMD bash

