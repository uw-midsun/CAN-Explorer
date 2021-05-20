FROM influxdb:2.0.4

# Change the following values if deployed anywhere 
ENV DOCKER_INFLUXDB_INIT_MODE=setup
# ENV DOCKER_INFLUXDB_INIT_USERNAME=firmware
# ENV DOCKER_INFLUXDB_INIT_PASSWORD=ilovecans 
# ENV DOCKER_INFLUXDB_INIT_ORG=midnightsun 
# ENV DOCKER_INFLUXDB_INIT_BUCKET=can_explorer
# # ENV DOCKER_INFLUXDB_INIT_RETENTION= 
# ENV DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=123456

ENV INFLUXDB_DB=can_explorer
ENV INFLUXDB_ADMIN_USER=root
ENV INFLUXDB_ADMIN_PASSWORD=root
ENV INFLUXDB_USER=firmware
ENV INFLUXDB_ADMIN_PASSWORD=ilovecans

#influx setup --org midnightsun --bucket can_explorer --username firmware --password ilovecans

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT [ "/docker-entrypoint.sh" ]
CMD [ "influxd" ]

