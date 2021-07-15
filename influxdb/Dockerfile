FROM influxdb:2.0.4

# Change the following values if deployed anywhere 
ENV DOCKER_INFLUXDB_INIT_MODE=setup

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD [ "influxd" ]
