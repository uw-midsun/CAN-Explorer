#!/bin/bash

# https://forums.docker.com/t/best-practice-to-run-a-bash-setup-script-after-creation-of-container/28988/2
# create setup here

influxd &

sleep 10

influx setup --name orig-config --org midnightsun --bucket orig_bucket --username firmware --password ilovecans --token 123456 --force
influx bucket create -n raw_data -o midnightsun -t 123456
influx bucket create -n converted_data -o midnightsun -t 123456

echo "Setup done!"

sleep infinity