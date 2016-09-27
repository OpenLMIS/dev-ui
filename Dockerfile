FROM openlmis/dev

WORKDIR /root
RUN apk add git && \
  bower install jquery --allow-root && \
  apk del git
WORKDIR /app

VOLUME ["/app"]
EXPOSE 8080
CMD ["bash"]
