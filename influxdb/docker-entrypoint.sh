#!/bin/bash

# https://forums.docker.com/t/best-practice-to-run-a-bash-setup-script-after-creation-of-container/28988/2
# create setup here

influxd &

sleep 10

influx setup --name orig-config --org midnightsun --bucket can_explorer --username firmware --password ilovecans --token 123456 --force

echo "Setup done!"

sleep infinity