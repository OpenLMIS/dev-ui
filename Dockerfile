FROM openlmis/dev

WORKDIR /root
RUN apk update && \
  apk add git && \
  npm install -g bower && \
  npm install -g grunt && \
  bower install jquery --allow-root && \
  apk del git
WORKDIR /app

VOLUME ["/app"]
EXPOSE 8080
CMD ["bash"]
