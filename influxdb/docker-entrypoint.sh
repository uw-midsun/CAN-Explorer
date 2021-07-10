#!/bin/bash

influxd &

# check if config has already been setup 
if [[ $(sed -n '/^\[orig-config\]/p;q' /etc/influxdb2/influx-configs) != "[orig-config]" ]]
then
    sleep 20
    influx setup --name orig-config --org midnightsun --bucket orig_bucket --username firmware --password ilovecans --token 123456 --force
    influx bucket create -n raw_data -o midnightsun -t 123456
    influx bucket create -n converted_data -o midnightsun -t 123456
    influx apply -o midnightsun -f /var/lib/influxdb2/can_explorer_template.yml --force true
    echo "Setup done!"
fi

echo "Starting up"

sleep infinity
