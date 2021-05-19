FROM influxdb:2.0.4

# Change the following values if deployed anywhere 
ENV DOCKER_INFLUXDB_INIT_USERNAME=firmware
ENV DOCKER_INFLUXDB_INIT_PASSWORD=ilovecans 
ENV DOCKER_INFLUXDB_INIT_ORG=midnightsun 
ENV DOCKER_INFLUXDB_INIT_BUCKET=can_explorer
# ENV DOCKER_INFLUXDB_INIT_RETENTION= 
ENV DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=123456

CMD influx setup \
  --org midnightsun \
  --bucket can_explorer \
  --username firmware \
  --password ilovecans \
  --force  

# CMD ["influxd"]

